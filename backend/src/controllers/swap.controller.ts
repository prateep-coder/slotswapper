import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../utils/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getSwappableSlots = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    const slots = await prisma.event.findMany({
      where: {
        status: 'SWAPPABLE',
        ownerId: { not: userId }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    res.json({ slots });
  } catch (error) {
    console.error('Get swappable slots error:', error);
    res.status(500).json({ error: 'Failed to fetch swappable slots' });
  }
};

export const createSwapRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const userId = req.user!.userId;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ error: 'Both slot IDs are required' });
    }

    // Verify both slots exist and are SWAPPABLE
    const [mySlot, theirSlot] = await Promise.all([
      prisma.event.findFirst({
        where: { 
          id: mySlotId, 
          ownerId: userId, 
          status: 'SWAPPABLE' 
        }
      }),
      prisma.event.findFirst({
        where: { 
          id: theirSlotId, 
          status: 'SWAPPABLE',
          ownerId: { not: userId }
        },
        include: { owner: true }
      })
    ]);

    if (!mySlot) {
      return res.status(400).json({ 
        error: 'Your slot is not available for swap or does not exist' 
      });
    }

    if (!theirSlot) {
      return res.status(400).json({ 
        error: 'The target slot is not available for swap or does not exist' 
      });
    }

    // Use transaction for atomic operations
    const result = await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
      // Create swap request
      const swapRequest = await transaction.swapRequest.create({
        data: {
          mySlotId,
          theirSlotId,
          requestorId: userId,
          responderId: theirSlot.ownerId
        }
      });

      // Update both slots to SWAP_PENDING
      await transaction.event.updateMany({
        where: {
          id: { in: [mySlotId, theirSlotId] }
        },
        data: {
          status: 'SWAP_PENDING'
        }
      });

      return swapRequest;
    });

    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: result.id },
      include: {
        mySlot: true,
        theirSlot: {
          include: {
            owner: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ swapRequest });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ error: 'Failed to create swap request' });
  }
};

export const respondToSwapRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;
    const userId = req.user!.userId;

    if (typeof accept !== 'boolean') {
      return res.status(400).json({ error: 'Accept field must be a boolean' });
    }

    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: requestId },
      include: {
        mySlot: true,
        theirSlot: true
      }
    });

    if (!swapRequest) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    // Check if user is the responder
    if (swapRequest.responderId !== userId) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }

    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'Swap request already processed' });
    }

    let message = '';

    if (accept) {
      // ACCEPT: Swap the owners using transaction
      await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
        // Swap owners
        await transaction.event.update({
          where: { id: swapRequest.mySlotId },
          data: { 
            ownerId: swapRequest.responderId, 
            status: 'BUSY' 
          }
        });

        await transaction.event.update({
          where: { id: swapRequest.theirSlotId },
          data: { 
            ownerId: swapRequest.requestorId, 
            status: 'BUSY' 
          }
        });

        // Update swap request status
        await transaction.swapRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' }
        });
      });

      message = 'Swap request accepted successfully';
    } else {
      // REJECT: Set slots back to SWAPPABLE using transaction
      await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
        await transaction.event.updateMany({
          where: {
            id: { in: [swapRequest.mySlotId, swapRequest.theirSlotId] }
          },
          data: {
            status: 'SWAPPABLE'
          }
        });

        await transaction.swapRequest.update({
          where: { id: requestId },
          data: { status: 'REJECTED' }
        });
      });

      message = 'Swap request rejected';
    }

    const updatedRequest = await prisma.swapRequest.findUnique({
      where: { id: requestId },
      include: {
        mySlot: true,
        theirSlot: true
      }
    });

    res.json({ 
      message,
      swapRequest: updatedRequest 
    });
  } catch (error) {
    console.error('Respond to swap request error:', error);
    res.status(500).json({ error: 'Failed to process swap request' });
  }
};

export const getIncomingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const requests = await prisma.swapRequest.findMany({
      where: {
        responderId: userId,
        status: 'PENDING'
      },
      include: {
        mySlot: true,
        theirSlot: true,
        requestor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ requests });
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ error: 'Failed to fetch incoming requests' });
  }
};

export const getOutgoingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const requests = await prisma.swapRequest.findMany({
      where: {
        requestorId: userId
      },
      include: {
        mySlot: true,
        theirSlot: true,
        responder: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ requests });
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({ error: 'Failed to fetch outgoing requests' });
  }
};
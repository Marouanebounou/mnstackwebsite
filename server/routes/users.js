import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mock data for demonstration
    const stats = {
      projects: 3,
      apiCalls: 1500,
      storage: 2.5,
    };

    const recentActivity = [
      {
        title: 'New Project Created',
        description: 'Project "E-commerce Website" was created',
        time: '2 hours ago',
      },
      {
        title: 'API Usage',
        description: '100 API calls made to Code Assistant',
        time: '5 hours ago',
      },
      {
        title: 'Storage Update',
        description: 'Added 500MB of new files',
        time: '1 day ago',
      },
    ];

    res.json({ stats, recentActivity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 
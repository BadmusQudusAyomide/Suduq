import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'suduq-api',
    now: new Date().toISOString()
  });
});

export default router;

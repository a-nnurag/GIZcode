import { Router } from 'express';
import { BPCODE_PATTERN, getBlockIndicators } from '../lib/indicators';

export const blockInfoRouter = Router();

blockInfoRouter.get('/:bpcode', (req, res) => {
  const { bpcode } = req.params;
  if (!BPCODE_PATTERN.test(bpcode)) {
    res.status(400).json({ error: 'Invalid bpcode' });
    return;
  }
  res.json({ bpcode, values: getBlockIndicators(bpcode) ?? {} });
});

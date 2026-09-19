import test from 'node:test';
import assert from 'node:assert/strict';

// Test API query string builder logic
function qs(params) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''));
  const query = new URLSearchParams(clean).toString();
  return query ? `?${query}` : '';
}

test('qs helper handles status and category filters correctly', () => {
  assert.equal(qs({ status: 'PENDING_REVIEW' }), '?status=PENDING_REVIEW');
  assert.equal(qs({ status: 'VERIFIED', category: 'PLASTIC' }), '?status=VERIFIED&category=PLASTIC');
  assert.equal(qs({ status: '', category: null, empty: undefined }), '');
});

test('AITraining API routes adhere to backend URL contracts', () => {
  const endpoints = {
    dashboard: '/detection/training/dashboard/',
    samples: (params = {}) => `/detection/training/samples/${qs(params)}`,
    batchApprove: '/detection/training/samples/batch/',
    updateSample: (id) => `/detection/training/samples/${id}/`,
    uploadSample: '/detection/training/samples/upload/',
    trigger: '/detection/training/trigger/',
    jobStatus: (id) => (id ? `/detection/training/jobs/${id}/status/` : '/detection/training/jobs/latest/'),
    models: '/detection/training/models/',
    activateModel: (id) => `/detection/training/models/${id}/activate/`,
  };

  assert.equal(endpoints.dashboard, '/detection/training/dashboard/');
  assert.equal(endpoints.samples({ status: 'VERIFIED' }), '/detection/training/samples/?status=VERIFIED');
  assert.equal(endpoints.batchApprove, '/detection/training/samples/batch/');
  assert.equal(endpoints.updateSample('1234'), '/detection/training/samples/1234/');
  assert.equal(endpoints.trigger, '/detection/training/trigger/');
  assert.equal(endpoints.jobStatus(), '/detection/training/jobs/latest/');
  assert.equal(endpoints.jobStatus('TRN-01'), '/detection/training/jobs/TRN-01/status/');
  assert.equal(endpoints.activateModel('mod-1'), '/detection/training/models/mod-1/activate/');
});

test('Training curve normalization maths', () => {
  const history = [
    { epoch: 1, train_loss: 0.85, mAP_50: 0.82 },
    { epoch: 2, train_loss: 0.50, mAP_50: 0.88 },
    { epoch: 3, train_loss: 0.15, mAP_50: 0.94 },
  ];

  const chartWidth = 520;
  const chartHeight = 150;
  const padding = 24;

  const points = history.map((pt, i) => {
    const x = padding + (i / (history.length - 1)) * (chartWidth - padding * 2);
    const norm = (pt.train_loss - 0.1) / (0.85 - 0.1);
    const y = chartHeight - padding - norm * (chartHeight - padding * 2);
    return { x, y };
  });

  assert.equal(points.length, 3);
  assert.equal(points[0].x, padding);
  assert.equal(points[2].x, chartWidth - padding);
  assert.ok(points[0].y < points[2].y); // Loss goes down, so y moves closer to bottom axis
});

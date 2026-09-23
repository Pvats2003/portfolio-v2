import type { CaseStudy } from '../types';

// Sources: resume (R-P5, R-P5.1) and Priyanshu's B.Tech report,
// "Automatic Number Plate Recognition System for Indian Vehicles" (MIT Manipal, May 2026) — "report" below.

export const anpr: CaseStudy = {
  slug: 'anpr',
  index: '05',
  title: 'ANPR',
  kicker: 'Automatic number plate recognition for Indian vehicles', // report title
  org: 'B.Tech final-year project · MIT Manipal',
  chips: [{ label: 'Completed' }, { label: 'Jan – May 2026' }], // report, R-P5
  tldr: [
    'A number-plate reader built for Indian conditions: regional fonts, older non-standard plates alongside new ones, and uneven lighting.', // report abstract
    'I trained a YOLOv8n detector from scratch on 1,695 real images covering 35 states: 89.1% mAP@50, about 32 ms per frame on a CPU.', // report, R-P5.1
    'Reading the text is the honest weak link — 42% of plates within two characters — and the report pins down why and what fixes it.', // report §4.3
  ],
  meta: [
    { label: 'Role', value: 'Individual final-year project, under faculty guidance' }, // report
    { label: 'Timeline', value: 'January – May 2026' }, // report project details, R-P5
    { label: 'Stack', value: 'YOLOv8n (Ultralytics) · PyTorch · OpenCV · Tesseract 5 · Gradio' }, // report, R-P5.1
    { label: 'Data', value: 'Public Kaggle Indian vehicle dataset · 1,695 images · 35 states' }, // report §3.3
  ],
  hero: { type: 'illustration', name: 'anpr' },
  chapters: [
    {
      id: 'problem',
      section: 'Problem',
      heading: 'Indian plates break generic plate readers',
      blocks: [
        {
          type: 'facts',
          items: [
            { value: '1,695', label: 'annotated images' }, // report §3.3
            { value: '35', label: 'states covered' }, // report §3.3
            { value: '8 GB', label: 'RAM, CPU only' }, // report Table 2, §3.7
          ],
        },
        {
          type: 'p',
          text: 'Commercial plate readers are tuned for standardised European and North American plates. Indian roads mix new high-security plates with older regional styles, under very different lighting — and few public pipelines target them.', // report abstract, §1.1, §2.1
        },
        { type: 'p', text: 'Privacy by default: the system logs only plate text, timestamp and confidence — no images or locations.' }, // report §1.4.2
      ],
    },
    {
      id: 'detector',
      section: 'Decision',
      heading: 'A nano-scale detector, trained short and small',
      blocks: [
        {
          type: 'tradeoff',
          caption: 'What training small bought, and what it cost',
          columnLabel: 'Choice',
          rows: [
            { dimension: 'Training time', result: 'About 17 minutes on a CPU', kind: 'gained' }, // report §3.4
            { dimension: 'Inference', result: '~32 ms per frame on a CPU (about 31 fps)', kind: 'gained' }, // report Table 5
            { dimension: 'Box tightness', result: 'mAP@50:95 of 44% — looser boxes than a longer run would give', kind: 'given-up' }, // report Table 5, §4.2
          ],
        },
        {
          type: 'p',
          text: 'YOLOv8n has about 3 million parameters — fast enough for a CPU. Pretrained weights couldn’t be downloaded in the training environment, so it trained from scratch: 320 px, five epochs, since the metrics had converged by epochs 4–5.', // report §3.4, Table 2
        },
      ],
    },
    {
      id: 'ocr',
      section: 'Decision',
      heading: 'Use what Indian plates must look like',
      blocks: [
        {
          type: 'table',
          caption: 'The plate format the grammar step enforces',
          head: ['Part', 'Format', 'Example'],
          rows: [
            ['State', '2 letters', 'MH'],
            ['District', '2 digits', '01'],
            ['Series', '1–3 letters', 'DB'],
            ['Number', '4 digits', '1477'],
          ],
        }, // report §3.5, §4.4
        {
          type: 'p',
          text: 'Each crop gets a nine-step clean-up, and Tesseract reads six variants of it. Then characters in the wrong kind of position are corrected — a 0 in the state code becomes O, an O in the district becomes 0 — and the state code is checked against the 35 valid ones.', // report §3.5
        },
      ],
    },
    {
      id: 'built',
      section: 'What I built',
      heading: 'The end-to-end pipeline',
      blocks: [
        {
          type: 'pipeline',
          caption: 'Works on images, video files, webcams and RTSP camera streams, behind a Gradio web interface.',
          steps: [
            { label: 'Input', detail: 'Image · video · webcam · RTSP' },
            { label: 'Low-light boost', detail: 'Only if the frame is dark' },
            { label: 'YOLOv8n detection', detail: 'Plate boxes + confidence', accent: true },
            { label: 'Crop', detail: '4 px padding' },
            { label: '9-step clean-up', detail: 'Upscale → … → pad' },
            { label: 'Tesseract ×6', detail: '3 modes × 2 variants' },
            { label: 'Grammar correction', detail: 'Indian plate format' },
          ],
        }, // report §3.2, §3.5
      ],
    },
    {
      id: 'outcome',
      section: 'Outcome',
      heading: 'Detection works; reading is the bottleneck',
      blocks: [
        {
          type: 'facts',
          items: [
            { value: '89.1%', label: 'mAP@50 (339 held-out images)' },
            { value: '85.3%', label: 'precision' },
            { value: '85.7%', label: 'recall' },
          ],
        }, // report Table 5, R-P5.1
        {
          type: 'table',
          caption: 'OCR on 50 test plates (ground-truth crops, so detection errors don’t count against it)',
          head: ['Metric', 'Result'],
          rows: [
            ['Exact match', '14%'],
            ['Within two characters', '42%'],
            ['Time per plate', '~1.2 s (six OCR passes)'],
          ],
          note: 'Plates wider than 200 px in the source read correctly (within two characters) more than 65% of the time; plates narrower than 80 px, under 20%.',
        }, // report Table 6, §4.3
        {
          type: 'p',
          text: 'The width breakdown located the problem: the resolution of the original crop, not the clean-up or the grammar step — which does work where it can, turning a misread “1MH01DB1477” into “MH01DB1477”.', // report §4.3, §4.4
        },
      ],
    },
    {
      id: 'learned',
      section: 'Learned',
      heading: 'What I learned',
      blocks: [
        {
          type: 'p',
          text: 'Report the weak number. The 42% OCR figure is in the report because it’s real, and breaking it down by plate width turned a disappointing result into a clear diagnosis — and a clear next step.', // report §1.5, §4.3
        },
        { type: 'todo', text: 'Anything else you took from the project, in your own words.' },
      ],
    },
    {
      id: 'next',
      section: 'Next',
      heading: 'Where it goes from here',
      blocks: [
        {
          type: 'table',
          caption: 'Next steps from the report',
          head: ['Area', 'Next step'],
          rows: [
            ['Reading', 'EasyOCR or PaddleOCR, or a plate recogniser (CRNN / LPRNet)'],
            ['Detector', '50 epochs at 640 px on a GPU, from pretrained weights'],
            ['Coverage', 'Two-wheeler plates'],
            ['Edge', 'ONNX / TensorFlow Lite for a Jetson Nano or Raspberry Pi 5'],
          ],
        }, // report §5.2
      ],
    },
  ],
};

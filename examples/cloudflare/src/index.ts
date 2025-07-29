import { Hono } from 'hono';
import { onRequestGet } from './examples';
import RootLayout from './layout';

const app = new Hono();

app.use('*', RootLayout);
app.get('/', onRequestGet);

export default app;

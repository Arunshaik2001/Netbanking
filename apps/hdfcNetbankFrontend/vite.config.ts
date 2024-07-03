import { defineConfig} from 'vite'
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + "/../../.env" })
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env
  },
  build: {
    "outDir": "dist"
  }
});

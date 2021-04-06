import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsConfigPath from 'vite-tsconfig-paths';
import styleImport from 'vite-plugin-style-import';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 为什么 sass-bem 模块无法识别，工作区的问题？？？
      '~': path.resolve(__dirname, './'), // 根路径
      '/@/': path.resolve(__dirname, './src'),
      '/@src/': path.resolve(__dirname, './src'),
      '/@components/': path.resolve(__dirname, './src/components'),
      '~antd': 'antd',
      '~@ant-design': '@ant-design',
    },
  },
  base: './',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    reactRefresh(),
    tsConfigPath(),
    styleImport({
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: (name: string) => {
            return `antd/es/${name}/style/index`;
          },
        },
        {
          libraryName: '@ant-design/pro-card',
          esModule: true,
          resolveStyle: (name: string) => {
            return `@ant-design/pro-card/es/${name}/style/index`;
          },
        },
      ],
    }),
  ],
});

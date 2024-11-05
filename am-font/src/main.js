import { createApp } from 'vue'
import App from './App.vue'

// 使用Element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 使用路由
import router from './routes/index'

// 引入css
import './assets/style/main.scss'

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.mount('#app');
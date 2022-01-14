import Vue from 'vue'
import App from './App.vue'

//Librerias importadas de primeface
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import InputMask from 'primevue/inputmask';
import Vuelidate from 'vuelidate';

//Css de primefaces
import 'primevue/resources/themes/saga-blue/theme.css';
import'primevue/resources/primevue.css';
import'primeicons/primeicons.css';

Vue.config.productionTip = false

//Agrega los componentes para usarlo en la applicacion
Vue.component('PrimeVue',PrimeVue);
Vue.component('DataTable',DataTable);
Vue.component('Column',Column);
Vue.component('Toolbar',Toolbar);
Vue.component('Button',Button);
Vue.component('Dialog',Dialog);
Vue.component('InputText',InputText);
Vue.component('Button',Button);
Vue.component('Toast',Toast);
Vue.component('InputMask',InputMask);
Vue.use(ToastService);
Vue.use(Vuelidate);



new Vue({
  render: h => h(App),
}).$mount('#app')

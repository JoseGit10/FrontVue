import axios from 'axios';

export default class EmpleadoService{
    BASE_URL = "http://localhost:8081/ApiRestVue/empleado";

    getAll(){
        return axios.get(`${this.BASE_URL}/`);
    }

    save(employee){
        if(employee.empId==null){
            return axios.post(`${this.BASE_URL}/agregarEmpleado`,employee);
        }
        else{
            return axios.post(`${this.BASE_URL}/actualizarEmpleado`,employee);
        }    
    }

    findById(id){
        return axios.get(`${this.BASE_URL}/buscarEmpleado/${id}`);
    }

    delete(id){
        return axios.get(`${this.BASE_URL}/borrarEmpleado/${id}`);
    }
}
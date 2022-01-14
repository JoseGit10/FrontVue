<template>
  <div class="inicio">
    <div>
      <h1>Empleados registrados</h1>
    </div>
    <div id="tabla">
      <Toolbar>
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            class="p-button-success p-mr-2"
            @click="openNew"
          />
        </template>
      </Toolbar>

      <DataTable
        :value="employee"
        :paginator="true"
        :rows="5"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[5,10, 20, 30]"
        responsiveLayout="scroll">
        
        <Column field="empNombre" header="Nombre/Apellido"></Column>
        <Column field="empAlias" header="Alias"></Column>
        <Column field="empDui" header="Dui"></Column>
        <Column field="correo" header="Correo"></Column>
        <template #paginatorstart>
          <Button type="button" icon="pi pi-refresh" @click="mostrarTodo()" />
        </template>
        <template #paginatorend>
        </template>
        <Column :exportable="false" :styles="{'min-width':'8rem'}">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-mr-2" @click="editEmployee(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="ModalOn(slotProps.data)" style="margin-left: 1rem;" />
            </template>
        </Column>
      </DataTable>
    </div>    

      <Dialog header="Nuevo Empleado" :visible.sync="dialog" :modal="true"  :style="{width: '50vw'}">
        <form class="formulario" >
          <div class="p-grid p-fluid ">
            <div class="input">
              <span class="p-float-label">
                <InputText id="username" type="text" v-model.trim="$v.personaAccion.empNombre.$model" 
                  :class="{'p-invalid':!$v.personaAccion.empNombre.$error,'p-valid': !$v.personaAccion.empNombre.$invalid}" 
                  aria-describedby="usuario-error"  /> 
                <label for="username">Nombre/Apellido</label>
              </span>
              <small v-if="!$v.personaAccion.empNombre.required" id="usuario-error" >El campo Nombre/Apellido es requerido<br /></small>
              <small v-if="!$v.personaAccion.empNombre.minLength" id="usuario-error">La longitud minima del campo es {{$v.personaAccion.empNombre.$params.minLength.min}} <br /></small>
              <small v-if="!$v.personaAccion.empNombre.maxLength" id="usuario-error">La longitud maxima del campo es {{$v.personaAccion.empNombre.$params.maxLength.max}}</small>
            </div>
            <div class="input">
              <span class="p-float-label">
                <InputMask v-model.trim="$v.personaAccion.empDui.$model" mask="99999999-9" 
                  id="DocumentoUnico" aria-describedby="DocumentoUnico-error" 
                  :class="{'p-invalid':!$v.personaAccion.empDui.$error,'p-valid':!$v.personaAccion.empDui.$invalid}" />
                <label for="DocumentoUnico">Dui</label>
              </span>
              <small v-if="!$v.personaAccion.empDui.required" id="DocumentoUnico-error" >El campo Dui es requerido.<br /></small>
            </div>
            <div class="input">
              <span class="p-float-label">
                <InputText id="correo"  v-model.trim="$v.personaAccion.correo.$model" 
                aria-describedby="correo-error" :class="{'p-invalid':!$v.personaAccion.correo.$error,'p-valid:':!$v.personaAccion.correo.$invalid}"  />
                <label for="correo-error">Correo</label>
              </span>
              <small v-if="!$v.personaAccion.correo.required" id="correo-error">Completar el campo<br /></small>
              <small v-if="!$v.personaAccion.correo.email" id="correo-error">Tiene que ser un correo ejemplo@ejemplo.com</small>
              
            </div>
            <div class="button">
                <Button label="Agregar empleado" class="p-button-success tamanio" @click.prevent="save()" :disabled="$v.$invalid" />
            </div>
            <div class="button t2">
                <Button label="cancelar" class="p-button-danger tamanio" @click="close()" />
            </div>
          </div>
                         
        </form> 
      </Dialog>

      <Dialog header="Eliminar empleado" :visible.sync="deleteModal" :styles="{width: '450px'}" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
          <span v-if="empDelete"> <br />Esta seguro que quiere eliminar el empleado <b>{{empDelete.empNombre}}</b>?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteModal = false"/>
          <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteEmployee(empDelete.empId)" />
        </template>
      </Dialog>
    <Toast />
  </div>
</template>

<script>
import EmployeeService from "../service/EmployeeService";
import {required,minLength,maxLength,email} from "vuelidate/lib/validators";
export default {
  name: "CrudVue",
  data() {
    return {
      
      empDelete: null,
      employee: null,
      dialog: false,
      deleteModal: false,
      formCompleto: true,
      cadenaConcatenada: '',
      personaAccion: {
        empId: null,
        empNombre: null,
        empAlias: null,
        empDui: null,
        correo: null,
        contrasenia: null,
      },
    };
  },
  EmployeeService: null,
  created() {
    this.EmployeeService = new EmployeeService();
  },
  mounted() {
    this.mostrarTodo();
  },
  methods: {
    mostrarTodo() {
      this.EmployeeService.getAll().then(
        (data) => {
          this.employee = data.data;
        },
        (errores) => {
          console.log(errores);
        }
      );
    },
    openNew() {
      this.dialog = true;
    },
    close(){
      this.dialog=false;
    },
    save(){      
      this.EmployeeService.save(this.personaAccion)
        .then(response => {
          this.dialog = false;
          this.mostrarTodo();
          response
          this.$toast.add({severity:'success', summary: 'Empleado guadado', detail: response.data.msj, life: 2000});
        })
        .catch(err =>{
          this.cadenaConcatenada += "";
          for(let item of err.response.data.errors){
            this.cadenaConcatenada += item+" \n";
          }
          console.log(this.cadenaConcatenada);
          this.$toast.add({severity:'error', summary: 'error al enviar formulario', detail: err.response.data.mensaje, life: 2000});
          this.cadenaConcatenada = "";
        }
      );
    },
    editEmployee(employee){
      this.dialog = true;
      this.EmployeeService.findById(employee.empId)
        .then(
          data =>{ 
             this.personaAccion = data.data
        })
        .catch( error =>{
          this.$toast.add({severity:'error',summary:'Error al encontrar empleado', detail: error.response.mensaje, life: 2000 })
        });
    },
    ModalOn(employee){
      this.empDelete = employee;
      this.deleteModal = true;
    },
    deleteEmployee(id){
      this.EmployeeService.delete(id)
      .then(response =>{
          this.deleteModal= false;
          this.mostrarTodo();
          this.$toast.add({severity:'success', summary: 'Empleado eliminado', detail: response.data.msj, life: 30000});
      })
      .catch(response => {
            this.deleteModal= false;
          this.$toast.add({severity:'error', summary: 'Error al eliminar', detail: response, life: 30000});
      });
    },
    setEmpNombre(value){
      this.personaAccion.empNombre = value;
      this.$v.personaAccion.empNombre.$touch();
    },
    setEmpDui(value){
      this.personaAccion.empDui = value;
      this.$v.personaAccion.empDui.$touch();
    }
  },
  validations:{
    personaAccion:{
      empNombre:{
        required,
        minLength: minLength(8),
        maxLength: maxLength(25),
      },
      empDui:{
        required,
        minLength: minLength(10),
      },
      correo:{
        required,
        email
      }
    }
  }
  

};
</script>


<style scoped>
.inicio {
  margin: 0 auto;
  width: 80%;
}

.input{
  padding: 20px;
  
}

.button{
  width: 49%;
}

.t2{
  position: relative;
  left:353px;
  bottom: 40px;
  right: 0;
}
.p-inputtext.p-valid.p-component{
  border-color:#218838;
}

</style>
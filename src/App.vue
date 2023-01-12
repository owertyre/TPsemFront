<template>
  <v-app>
    <v-main>
      <v-card-title>
        <p class="font-weight-medium mt-5">Занимаемые должности</p>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск по сотруднику"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

 <v-card-title>
  <v-btn
    class="mr-5"
    color="#D3D3D3"
    @click="average_salary"
  >
  Посчитать среднюю зарплату
  </v-btn>
  <v-btn
    class="mr-5"
    color="#D3D3D3"
    @click="min_salary"
  >
  Посчитать минимальную зарплату
  </v-btn>
  <v-btn
    color="#D3D3D3"
    @click="max_salary"
  >
  Посчитать максимальную зарплату
  </v-btn>
</v-card-title>

      <v-card-title class="d-flex justify-end mb-6">
        <v-checkbox
          class="mb-5 pr-5"
          label="Показывать уволенных"
          color="green darken-1"
          value="green darken-1"
          v-model="checkbox1"
          hide-details
          @click="changeStaff"
          v-bind:false-value=false
          v-bind:true-value=true
        ></v-checkbox>

          <v-dialog
            v-model="dialog"
            max-width="700px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-5"
                color="green lighten-3"
                elevation="2"
                v-bind="attrs"
                v-on="on"
              >
              принять на должность
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Принять на должность</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="filterStaff.name"
                        label="Сотрудник"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="filterStaff.companyName"
                        label="Компания"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="filterStaff.positionName"
                        label="Должность"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="filterStaff.hireDate"
                        label="Дата приёма"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      class="d-flex flex-row"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        class="pr-3"
                        v-model="filterStaff.salary"
                        label="Ставка, руб"
                      ></v-text-field>
                      <v-text-field
                        v-model="filterStaff.fraction"
                        label="Ставка, %"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="filterStaff.base"
                        label="База"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="filterStaff.advance"
                        label="Аванс"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                    Почасовая
                    <v-simple-checkbox
                      v-model="filterStaff.byHours"
                      color="green darken-1" 
                    ></v-simple-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  отменить
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="add(filterStaff)"
                >
                  сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        <v-btn
          id="btn_delete"
          color="#FF8A80"
          elevation="2"
          :disabled="isChoosed"
          @click="updateFireDate(selected)"
        >снять с должности
        </v-btn>
      </v-card-title>
    
      <div>
        <v-data-table
          :headers="headers"
          :items="filterStaff"
          :search="search"
          :item-class= "row_classes"
          :footerProps="{
            itemsPerPageText: 'Строк на странице',
            pageText: 'С {0} по {1} из {2}'
          }"
          v-model="selected"
          item-key="name"
          show-select
          @toggle-select-all="selectAllToggle"
          class="elevation-1"
        >

          <template v-slot:[`item.data-table-select`]="{ item, select, isSelected }">
            <v-simple-checkbox 
              :value="isSelected"
              :readonly="!(item.fireDate == null)"
              :disabled="!(item.fireDate == null)"
              :hidden="!(item.fireDate == null)"
              @click="btn_visual(item, isSelected)"
              @input="select($event)"
            ></v-simple-checkbox>
          </template>


          <template v-slot:[`item.salary_fraction`]="{ item }">
            <div v-if="item.fireDate==null">
              <v-edit-dialog
                  @cancel="returnSF"
                  large
                  persistent
                  cancel-text="отменить"
                  save-text="сохранить"
                  @save="update(item)"
            >
                <div>{{ item.salary }} ₽ ({{ item.fraction }}%)</div>
                <template v-slot:input>
                  <div class="d-flex">
                    <div class="d-flex flex-column">
                    <div class="mt-3 mb-0">
                      <p>Ставка, руб</p>
                    </div>
                    <v-text-field
                      v-model="item.salary"
                      label="Edit"
                      single-line
                      autofocus
                      class="mt-0 pt-0"
                    ></v-text-field>
                    </div>
                    <div class="d-flex flex-column">
                    <div class="mt-3 ml-3 mb-0">
                      <p>Ставка,%</p>
                    </div>
                    <v-text-field
                      v-model="item.fraction"
                      label="Edit"
                      single-line
                      autofocus
                      class="mt-0 pt-0 ml-3"
                    ></v-text-field>
                  </div>
                  </div>
                </template>
              </v-edit-dialog>
            </div>
            <div v-else>
              <div>{{ item.salary }} ₽ ({{ item.fraction }}%)</div>
            </div>
          </template>
          <template v-slot:[`item.base`]="{ item }">
            <div v-if="item.fireDate==null">
              <v-edit-dialog
                  :return-value.sync="item.base"
                  large
                  persistent
                  cancel-text="отменить"
                  save-text="сохранить"
                  @save="update(item)"
            >
              <div>{{ item.base }} ₽</div>
              <template v-slot:input>
                  <div class="mt-3 mb-0">
                    <p>База, руб</p>
                  </div>
                  <v-text-field 
                    v-model="item.base"
                    label="Edit"
                    single-line
                    autofocus
                    class="mt-0 pt-0"
                    >
                  </v-text-field>
              </template>
            </v-edit-dialog>
            </div>
            <div v-else>
              <div>{{ item.base }} ₽</div>
            </div>
          </template>
          <template v-slot:[`item.advance`]="{ item }">
            <div v-if="item.fireDate==null">
              <v-edit-dialog
                  :return-value.sync="item.advance"
                  large
                  persistent
                  cancel-text="отменить"
                  save-text="сохранить"
                  @save="update(item)"
            >
              <div>{{ item.advance }} ₽</div>
              <template v-slot:input>
                  <div class="mt-3 mb-0">
                    <p>Аванс, руб</p>
                  </div>
                  <v-text-field 
                    v-model="item.advance"
                    label="Edit"
                    single-line
                    autofocus
                    class="mt-0 pt-0"
                    >
                  </v-text-field>
              </template>
            </v-edit-dialog>
            </div>
            <div v-else>
              <div>{{ item.advance }} ₽</div>
            </div>
          </template>
          <template v-slot:[`item.byHours`]="{ item }">
            <v-simple-checkbox
              v-model="item.byHours"
              color="green darken-1" 
              :disabled="!(item.fireDate == null)"
              @click = "update(item)"
            ></v-simple-checkbox>
          </template>
          
        </v-data-table>
      </div>
    </v-main>
  </v-app>
</template>

<script>

import moment from 'moment'
import axios from 'axios'


export default {

  async mounted() {
    let staff = await this.fetchData()
    staff.forEach(person => {person.hireDate = moment(person.hireDate).format("DD.MM.YYYY");
    if (person.fireDate !== null) {
      person.fireDate = moment(person.fireDate).format("DD.MM.YYYY");
      this.disabledCount += 1
    }
  })
    this.filterStaff = staff
    this.allStaff = staff

  },

  methods: {
    row_classes(item) {
      if (item.fireDate !== null) {
          return "row_color"; 
      } 
    },

    close () {
      this.dialog = false
    },

    selectAllToggle(props) {
       if(this.selected.length != this.filterStaff.length - this.disabledCount) {
       
         this.selected = [];
         const self = this;
         props.items.forEach(item => {
           if(item.fireDate == null) {
             self.selected.push(item);
           } 
         });
       } else this.selected = [];

       if (this.selected.length == 0) {
          this.isChoosed = true
        } else {
          this.isChoosed = false
        }
       let button = document.getElementById("btn_delete")
        if (this.selected.length > 1) {
          button.textContent = "снять с должностей"
        } else {
          button.textContent = "снять с должности"
        }  
     },

    async returnSF(){
      let staff = await this.fetchData()
      this.filterStaff = staff
      this.allStaff = staff
      console.log(this.allStaff);},

    changeStaff() {
      if(this.checkbox1) {
        this.filterStaff = this.allStaff
      } else {
        this.filterStaff = this.allStaff.filter(f => f.fireDate == null)
      }
    },

    async fetchData() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/graphql/', { query: `{ 
  allStaff{
    id
    name
    companyName
    positionName
    hireDate
    fireDate
    salary
    fraction
    base
    advance
    byHours
  } }`
 }); response.data.data.allStaff.forEach(item => {
        console.log(item);
      })
 return response.data.data.allStaff
      } catch (a) {
      alert(a);
    }
  },

  async average_salary() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/graphql/', {
          query: `{ 
  allStaff{
    salary
  } }`
 }); 
      this.allQQQ = 0
      let AAAAAAA = response.data.data.allStaff
      response.data.data.allStaff.forEach(item => {
        let averageSalary = item.salary
        this.allQQQ += averageSalary
      })
      alert("Среднее значение зарплаты: " + this.allQQQ / AAAAAAA.length + ' рублей');
      } catch (a) {
      alert(a);
    }
  },

  async min_salary() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/graphql/', {
          query: `{ 
  allStaff{
    salary
  } }`
 }); 
      let FFF = []
      let AAAAAAA = response.data.data.allStaff
      AAAAAAA.forEach(item => {
        FFF.push(item.salary)
      })
      let m = Math.min.apply(null, FFF);
      alert("Минимальное значение зарплаты: " + m + ' рублей');
      } catch (a) {
      alert(a);
    }
  },

  async max_salary() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/graphql/', {
          query: `{ 
  allStaff{
    salary
  } }`
 }); 
      let FFF = []
      let AAAAAAA = response.data.data.allStaff
      AAAAAAA.forEach(item => {
        FFF.push(item.salary)
      })
      let m = Math.max.apply(null, FFF);
      alert("Максимальное значение зарплаты: " + m + ' рублей');
      } catch (a) {
      alert(a);
    }
  },

  async update(item) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/graphql/', { query: 
          `mutation updatemutation($id: ID, $salary: Int!, $fraction: Int!, $advance: Int!, $base: Int!, $byHours: Boolean!){
            updateOccupation(id: $id, advance:$advance, base:$base, byHours:$byHours, fraction:$fraction,salary:$salary) {
              staff{
                id
                fireDate
                advance
                base
                byHours
                fraction
                salary
              }
            }
          }`, variables: {
                id: Number(item.id),
                advance: Number(item.advance),
                base: Number(item.base),
                byHours: item.byHours,
                fraction: Number(item.fraction),
                salary: Number(item.salary)
        }}); 
        return response.data.data.allStaff
      } catch (a) {
        alert(a);
        }
  }, 

  async updateFireDate(list_fd) {
    for (var i = 0; i < list_fd.length; i++) {
      try {
        // eslint-disable-next-line
        const response = await axios.post('http://127.0.0.1:8000/graphql/', { query:
          `mutation updatefdmutation($id: ID){
  updateFiredate(id:$id,
   ) {
    staff{
      id
    }
  }
}`, variables: {
id: Number(list_fd[i].id),
}}); let staff = await this.fetchData()
        this.filterStaff = staff
        this.allStaff = staff
        staff.forEach(person => {person.hireDate = moment(person.hireDate).format("DD.MM.YYYY");
        if (person.fireDate !== null) {
          person.fireDate = moment(person.fireDate).format("DD.MM.YYYY");
        }
    
  }) 
        
      } catch (a) {
        alert(a);
        }
    }  
        this.isChoosed = true
        this.selected = []
        let button = document.getElementById("btn_delete")
        button.textContent = "снять с должности"
  },

  async add(item) {
    if (!item.byHours) {
      item.byHours = false
    }
      try {
        // eslint-disable-next-line
        const response = await axios.post('http://127.0.0.1:8000/graphql/', { query: 
          `mutation addmutation($name: String!, $companyName: String!, $positionName: String!, $hireDate: Date!, $salary: Int!, $fraction: Int!, $advance: Int!, $base: Int!, $byHours: Boolean!){
  addOccupation(name:$name,
    companyName:$companyName,
    positionName: $positionName,
    hireDate: $hireDate,
    advance:$advance,
    base:$base,
    byHours:$byHours,
    fraction:$fraction,
    salary:$salary) {
    staff{
      name
      companyName
      positionName
      hireDate
      advance
      base
      byHours
      fraction
      salary
    }
  }
}
`, variables: {
          name: item.name,
          companyName: item.companyName,
          positionName: item.positionName,
          hireDate: item.hireDate,
          advance: Number(item.advance),
          base: Number(item.base),
          byHours: item.byHours,
          fraction: Number(item.fraction),
          salary: Number(item.salary)
        }}); 
        this.close()
        let staff = await this.fetchData()
        this.filterStaff = staff
        this.allStaff = staff
      } catch (a) {
        alert(a);
        }
  }, 

  

  btn_visual(item, isSelected){
    if (!isSelected) {
      this.selected.push(item)
    } else {
      let i = this.selected.indexOf(item)
      this.selected.splice(i, 1)
    }
    if (this.selected.length == 0) {
      this.isChoosed = true
    } else {
      this.isChoosed = false
    }
    let button = document.getElementById("btn_delete")
    if (this.selected.length > 1) {
      button.textContent = "снять с должностей"
    } else {
      button.textContent = "снять с должности"
    }
  }
},

  data () {

  return {
    allQQQ: 0,
    search: '',
    staff: [],
    checkbox1: true,
    disabledCount: 0,
    filterStaff: [],
    selected: [],
    isChoosed: true,
    dialog: false,
    choosedList: [],
    singleSelect: false,
    headers: [
      {
        text: 'Сотрудник',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'Компания', value: 'companyName', sortable: false, filterable: false,},
      { text: 'Должность', value: 'positionName', sortable: false, filterable: false, },
      { text: 'Дата приёма', value: 'hireDate', sortable: false, filterable: false, },
      { text: 'Дата увольнения', value: 'fireDate', sortable: false, filterable: false},
      { text: 'Ставка', value: 'salary_fraction', sortable: false, filterable: false, },
      { text: 'База', value: 'base', sortable: false, filterable: false, },
      { text: 'Аванс', value: 'advance', sortable: false, filterable: false, },
      { text: 'Почасовая', value: 'byHours', sortable: false, filterable: false, },
    ],
  }
},
}
</script>

<style>

.row_color {
  background-color: #FF8A80!important;
}

.btn_color {
  background-color: #FF8A80
}

</style>
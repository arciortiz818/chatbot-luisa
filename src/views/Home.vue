<template>
  <b-container>
    <b-col v-for="item in chatHistory" :key="item.id" class="px-0">
      <!-- Mensaje del usuario -->
      <message-user
        v-if="item.author == 'user'"
        :text="item.message"
        class="my-3"
      ></message-user>

      <!-- Mensaje de agente -->
      <message-agent
        v-if="item.author == 'agent'"
        :text="item.message"
        :intent="item.intent"
      >
        <!-- slot de autorización datos -->
        <template v-slot:personal-data>
          <b-row class="mx-3 mt-3 justify-content-center">
            <b-button
              class="mr-2 btn-message"
              @click="sendRta('si')"
              :disabled="item.id < chatHistory.length"
              >Si</b-button
            >
            <b-button
              class="btn-message"
              @click="sendRta('no')"
              :disabled="item.id < chatHistory.length"
              >No</b-button
            >
          </b-row>
        </template>

        <!-- slot para opciones principales -->
        <template v-slot:main-options>
          <b-row class="mt-3" v-for="option in item.options" :key="option.name">
            <b-button
              block
              class="btn-message mx-4"
              @click="sendRta(option.name)"
              :disabled="item.id < chatHistory.length"
              >{{ option.value }}</b-button
            >
          </b-row>
        </template>

        <!-- slot para opciones principales -->
        <template v-slot:request-send>
          <b-row class="mt-3">
            <b-button
              block
              class="btn-message mx-4"
              @click="sendRta('si')"
              :disabled="item.id < chatHistory.length"
              >Si, ir al menú princpal</b-button
            >
            <b-button
              block
              class="btn-message mx-4"
              @click="sendRta('no')"
              :disabled="item.id < chatHistory.length"
              >No</b-button
            >
          </b-row>
        </template>

        <!-- slot para opción de citas médicas -->
        <template v-slot:citas-medicas>
          <b-row class="mx-3 mt-2 justify-content-center">
            <b-form @submit="onSubmitCitMed" class="col-10">
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCitasMedicas.nombre"
                id="form1-input0"
                placeholder="Nombre completo"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCitasMedicas.docIdentidad"
                id="form1-input1"
                placeholder="Documento Identidad"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCitasMedicas.telefono"
                id="form1-input2"
                placeholder="Teléfono o Celular"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCitasMedicas.email"
                id="form1-input3"
                placeholder="Email"
                type="email"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-select
                class="mb-2"
                size="sm"
                v-model="formCitasMedicas.servicioCita"
                id="form1-input4"
                placeholder="Servicio para su cita"
                required
                :options="[
                  { text: 'Servicio para su cita...', value: null },
                  'ECOGRAFIA',
                  'CONSULTA EXTERNA',
                  'SERVICIOS AMBULATORIOS',
                ]"
                :disabled="item.id < chatHistory.length"
              ></b-form-select>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCitasMedicas.ipsRemite"
                id="form1-input5"
                placeholder="IPS que remite"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-row>
                <b-col>
                  <b-button
                    class="btn-message"
                    type="submit"
                    block
                    variant="light"
                    :disabled="item.id < chatHistory.length"
                    >Enviar</b-button
                  >
                </b-col>
                <b-col>
                  <b-button
                    class="btn-message col"
                    block
                    variant="light"
                    @click="sendRta('main-options')"
                    :disabled="item.id < chatHistory.length"
                    >Cancelar</b-button
                  >
                </b-col>
              </b-row>
            </b-form>
          </b-row>
        </template>

        <!-- slot para opción de vacunas-covid -->
        <template v-slot:vacunacion-covid>
          <b-row class="mt-2 justify-content-center">
            <b-form @submit="onSubmitVacCov" class="col-10">
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formVacunasCovid.nombre"
                id="form2-input0"
                placeholder="Nombre completo"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formVacunasCovid.docIdentidad"
                id="form2-input1"
                placeholder="Documento Identidad"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formVacunasCovid.telefono"
                id="form2-input2"
                placeholder="Teléfono o Celular"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formVacunasCovid.email"
                id="form2-input3"
                placeholder="Email"
                type="email"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-row>
                <b-col>
                  <b-button
                    class="btn-message"
                    type="submit"
                    block
                    variant="light"
                    :disabled="item.id < chatHistory.length"
                    >Enviar</b-button
                  >
                </b-col>
                <b-col>
                  <b-button
                    class="btn-message col"
                    block
                    variant="light"
                    @click="sendRta('main-options')"
                    :disabled="item.id < chatHistory.length"
                    >Cancelar</b-button
                  >
                </b-col>
              </b-row>
            </b-form>
          </b-row>
        </template>

        <!-- slot para opción de cirugías y preanestesia -->
        <template v-slot:cirugia-preanestesia>
          <b-row class="mt-2 justify-content-center">
            <b-form @submit="onSubmitCirPre" class="col-10">
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCirugiaPreanestesia.nombre"
                id="form3-input0"
                placeholder="Nombre completo"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCirugiaPreanestesia.docIdentidad"
                id="form3-input1"
                placeholder="Documento Identidad"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCirugiaPreanestesia.telefono"
                id="form3-input2"
                placeholder="Teléfono o Celular"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-input
                class="mb-2"
                size="sm"
                v-model="formCirugiaPreanestesia.email"
                id="form3-input3"
                placeholder="Email"
                type="email"
                required
                :disabled="item.id < chatHistory.length"
              ></b-form-input>
              <b-form-file
                class="mb-2"
                size="sm"
                required
                v-model="formCirugiaPreanestesia.ordenMedica"
                :state="Boolean(formCirugiaPreanestesia.ordenMedica)"
                placeholder="Adjuntar Orden Médica"
                accept=".pdf"
                name="ordmed"
                @change="onFileOneChange"
              ></b-form-file>
              <b-form-file
                class="mb-2"
                size="sm"
                required
                v-model="formCirugiaPreanestesia.autorizacionEps"
                :state="Boolean(formCirugiaPreanestesia.autorizacionEps)"
                placeholder="Adjuntar Autorización Eps"
                accept=".pdf"
                @change="onFileTwoChange"
              ></b-form-file>
              <b-form-file
                class="mb-2"
                size="sm"
                required
                v-model="formCirugiaPreanestesia.historiaClinica"
                :state="Boolean(formCirugiaPreanestesia.historiaClinica)"
                placeholder="Adjuntar Historia Clínica"
                accept=".pdf"
                @change="onFileThreeChange"
              ></b-form-file>
              <b-row>
                <b-col>
                  <b-button
                    class="btn-message"
                    type="submit"
                    block
                    variant="light"
                    :disabled="item.id < chatHistory.length"
                    >Enviar</b-button
                  >
                </b-col>
                <b-col>
                  <b-button
                    class="btn-message col"
                    block
                    variant="light"
                    @click="sendRta('main-options')"
                    :disabled="item.id < chatHistory.length"
                    >Cancelar</b-button
                  >
                </b-col>
              </b-row>
            </b-form>
          </b-row>
        </template>

        <!-- slot para opción de Solicitud Historia Clínica -->
        <template v-slot:historia-clinica>
          <b-row class="mt-2 justify-content-start">
            <b-col>
              <p class="mb-2">
                Para solicitud de historia clínica, por favor tenga en cuenta la
                siguiente información:
              </p>
              <p class="mb-2">
                Debes hacer la solicitud al correo electronico
                <span style="font-weight: bold; color: #2b6095;">
                  historias_clinicas@clinicasanluis.com.co</span
                >
                y adjuntar los siguientes documentos:
              </p>
              <ul style="list-style: none; margin: 0; padding: 0;">
                <li>1. Documento del paciente (TI, CC, RC, CE)</li>
                <li>
                  2. En caso de ser menor de edad, se debe adjuntar documento de
                  uno de los padres para acreditar parentezco.
                </li>
                <li>
                  3. Fecha de la historia clínica que solicitas o el reporte de
                  resultados.
                </li>
              </ul>
              <p class="mt-2">
                RECUERDA: La respuesta será enviada en el trascurso de 3 días
                hábiles a partir de la fecha de solicitud
              </p>
            </b-col>
          </b-row>
          <b-row class="mt-3">
            <b-button
              block
              class="btn-message mx-4"
              @click="sendRta('Menú Principal')"
              :disabled="item.id < chatHistory.length"
              >Entendido</b-button
            >
          </b-row>
        </template>
      </message-agent>
    </b-col>
  </b-container>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from "vuex";
import MessageUser from "@/components/MessageUser.vue";
import MessageAgent from "@/components/MessageAgent.vue";

export default {
  name: "Home",
  components: {
    MessageUser,
    MessageAgent,
  },
  data() {
    return {
      messageUser: "",
      formCitasMedicas: {
        nombre: "",
        docIdentidad: "",
        telefono: "",
        email: "",
        servicioCita: null,
        ipsRemite: "",
      },
      formVacunasCovid: {
        nombre: "",
        docIdentidad: "",
        telefono: "",
        email: "",
      },
      formCirugiaPreanestesia: {
        nombre: "",
        docIdentidad: "",
        telefono: "",
        email: "",
        ordenMedica: null,
        autorizacionEps: null,
        historiaClinica: null,
      },
    };
  },
  updated() {
    if (document.getElementById("box-messages")) {
      const scroll = document.getElementById("box-messages").scrollTop;
      document.getElementById("box-messages").scrollTop = scroll + 1000;
    }
  },
  computed: {
    ...mapState(["chatHistory", "currentIntent"]),
  },
  mounted() {
    //Enviamos mensaje para indicar que inicia
    this.sendMessage({ message: "greetings" });
  },
  methods: {
    ...mapActions(["sendMessage", "sendEmail"]),
    sendRta(rta) {
      this.sendMessage({ message: rta });
    },
    onSubmitCitMed(event) {
      event.preventDefault();
      const datosEmail = `
	       <div>
	         <table>
	           <tbody>
               <tr>
	               <td><b>Nombre Completo:</b></td>
	               <td>${this.formCitasMedicas.nombre}</td>
	             </tr>
	             <tr>
	               <td><b>Documento de Identificación:</b></td>
	               <td>${this.formCitasMedicas.docIdentidad}</td>
	             </tr>
	             <tr>
	               <td><b>Teléfono:</b></td>
	               <td>${this.formCitasMedicas.telefono}</td>
	             </tr>
	             <tr>
	               <td><b>Email:</b></td>
	               <td>${this.formCitasMedicas.email}</td>
	             </tr>
	             <tr>
	               <td><b>Servicio para la cita:</b></td>
	               <td>${this.formCitasMedicas.servicioCita}</td>
	             </tr>
               <tr>
	               <td><b>Ips que remite:</b></td>
	               <td>${this.formCitasMedicas.ipsRemite}</td>
	             </tr>
	           </tbody>
	         </table>
	       </div>
	     `;
      this.sendEmail({
        to: process.env.VUE_APP_EMAIL_CITAS,
        message: datosEmail,
        subject: "Solicitud de Cita Médica - Luisa",
        intent: "Form Citas Médicas",
      });
      this.formCitasMedicas = {
        nombre: "",
        docIdentidad: "",
        telefono: "",
        email: "",
        servicioCita: null,
        ipsRemite: "",
      };
    },
    onSubmitVacCov(event) {
      event.preventDefault();
      const datosEmail = `
	       <div>
	         <table>
	           <tbody>
               <tr>
	               <td><b>Nombre Completo:</b></td>
	               <td>${this.formVacunasCovid.nombre}</td>
	             </tr>
	             <tr>
	               <td><b>Documento de Identificación:</b></td>
	               <td>${this.formVacunasCovid.docIdentidad}</td>
	             </tr>
	             <tr>
	               <td><b>Teléfono:</b></td>
	               <td>${this.formVacunasCovid.telefono}</td>
	             </tr>
	             <tr>
	               <td><b>Email:</b></td>
	               <td>${this.formVacunasCovid.email}</td>
	             </tr>
	           </tbody>
	         </table>
	       </div>
	     `;
      this.sendEmail({
        to: process.env.VUE_APP_EMAIL_COVID,
        message: datosEmail,
        subject: "Vacunación Covid-19 - Luisa",
        intent: "Form Vacunación Covid",
      });
      this.formVacunasCovid = {
        nombre: "",
        docIdentidad: "",
        telefono: "",
        email: "",
      };
    },
    onSubmitCirPre(event) {
      event.preventDefault();
      const datosEmail = `
            <div>
              <table>
                <tbody>
                  <tr>
                    <td><b>Nombre Completo:</b></td>
                    <td>${this.formCirugiaPreanestesia.nombre}</td>
                  </tr>
                  <tr>
                    <td><b>Documento de Identificación:</b></td>
                    <td>${this.formCirugiaPreanestesia.docIdentidad}</td>
                  </tr>
                  <tr>
                    <td><b>Teléfono:</b></td>
                    <td>${this.formCirugiaPreanestesia.telefono}</td>
                  </tr>
                  <tr>
                    <td><b>Email:</b></td>
                    <td>${this.formCirugiaPreanestesia.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `;
      this.sendEmail({
        to: process.env.VUE_APP_EMAIL_PREANESTESIA,
        message: datosEmail,
        subject: "Cirugia y Preanestesia - Luisa",
        intent: "Form Cirugia y Preanestesia",
        atached: true,
        docIdentidad: this.formCirugiaPreanestesia.docIdentidad,
        files: [
          this.formCirugiaPreanestesia.ordenMedica,
          this.formCirugiaPreanestesia.autorizacionEps,
          this.formCirugiaPreanestesia.historiaClinica,
        ],
      });
      this.formCirugiaPreanestesia = {
        nombre: "",
        docIdentidad: "",
        telefono: "",
        email: "",
        ordenMedica: null,
        autorizacionEps: null,
        historiaClinica: null,
      };
    },
    onFileOneChange(event) {
      this.formCirugiaPreanestesia.ordenMedica = event.target.files[0];
    },
    onFileTwoChange(event) {
      this.formCirugiaPreanestesia.autorizacionEps = event.target.files[0];
    },
    onFileThreeChange(event) {
      this.formCirugiaPreanestesia.historiaClinica = event.target.files[0];
    },
  },
};
</script>

<style></style>

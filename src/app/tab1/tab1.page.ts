import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from
  '@angular/forms';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PessoaService } from '../service/PessoaService';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormPessoa } from "../form-pessoa";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, ReactiveFormsModule, FormPessoa],
})


export class Tab1Page {
  formGroup: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    telefone: [''],
    email: ['', Validators.email],
    hobie: ['']
  })




  constructor(private fb: FormBuilder,
    private alertController: AlertController,
    private pessoaService: PessoaService,
    private activatedRouter: ActivatedRoute) { }

  emailToEdit: string | null = null;

  ionViewDidEnter(): void {

    this.emailToEdit = null
    const email = this.activatedRouter.snapshot.paramMap.get("email");
    if (email) {
      console.log(email)
      this.pessoaService.get(email).then(pessoa => {
        if (pessoa) {
          this.formGroup.patchValue(pessoa)
          this.emailToEdit = email
        }
      })
    }
  }



  async salvar() {
    if (this.formGroup.valid) {
    if(this.emailToEdit) {
    this.pessoaService.editar(this.formGroup.value, this.emailToEdit)
    }else {
    this.pessoaService.criar(this.formGroup.value)
    }
    const alert = await this.alertController.create({
    header: ' salvo',
    message: ' salvo com sucesso',
    buttons: ['OK'],
    })
    await alert.present()
    } else {
    const alert = await this.alertController.create({
    header: 'Formulário inválido',
    message: 'Formulário inválido',
    buttons: ['OK'],
    })
    await alert.present()
    }
    }

}


//Vinicius Santos

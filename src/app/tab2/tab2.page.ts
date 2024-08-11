import { Component } from '@angular/core';
import { IonicModule, ViewDidEnter, ToastController, LoadingController } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { Pessoa } from '../Pessoa';
import { PessoaService } from '../service/PessoaService';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, distinctUntilChanged, debounceTime } from 'rxjs';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule, ReactiveFormsModule]
})
export class Tab2Page implements ViewDidEnter {
  pessoas: Pessoa[] = []
  isToastOpen = false
  loading = false
  filterForm: FormGroup;
  subscriptions: Subscription[] = []


   setOpen(open: boolean) {
    this.isToastOpen = open;
  }

  constructor(
    private pessoaService: PessoaService,
    private router: Router,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      nome: ['']
    });
  }

  ionViewDidEnter(): void {
    this.listar()
  }


  async deletar(pessoa: Pessoa) {
    const deletado = await this.pessoaService.delete(pessoa.email)
    if (deletado) {
      this.listar()
      const toast = await this.toastController.create({
        message: 'Pessoa deletada com sucesso',
        duration: 1500,
        position: 'top'
      });
      await toast.present();
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Dismissing after 3 seconds...',
      duration: 3000,
    });
    loading.present();
  }



  listar() {
    this.loading = true
    this.pessoaService.listar().then((data) => {
      if (data) {
        this.pessoas = data
      }
      this.loading = false
    }).catch(error => {
      console.error(error)
      this.loading = false
    })
  }

  async filtrar(nome: string) {
    const pessoas = await this.pessoaService.findByNome(nome)
    this.pessoas = pessoas
  }


  editar(pessoa: Pessoa) {
    this.router.navigate(['tabs/tab1', pessoa.email])
  }

  ngOnInit(): void {
    const sub = this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => this.filtrar(value.nome!))
    this.subscriptions.push(sub)
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }


}


//Vinicius Santos

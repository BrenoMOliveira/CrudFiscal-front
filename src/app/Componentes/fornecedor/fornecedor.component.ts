import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FornecedorService } from '../../Pages/Fornecedores/fornecedor.service';
import { Fornecedor } from '../../Pages/Fornecedores/Fornecedor';
import { NotaFiscalService } from '../../Pages/NotaFiscal/nota-fiscal.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { NotaFiscal } from '../../Pages/NotaFiscal/NotaFiscal';
import { NotaFiscalComponent } from '../notaFiscal/nota-fiscal.component';

@Component({
  selector: 'app-fornecedor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css'],
  providers: [provideNgxMask()]
})

export class FornecedorComponent implements OnInit {
  formulario!: FormGroup;
  tituloFormulario!: string;
  nomeFantasia!: string;
  cnpj!: string;
  fornecedores: Fornecedor[] = [];
  fornecedorId!: number;
  nfE!: FormGroup;
  notasFiscais: NotaFiscal[] = [];

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;
  visibilidadeFormularioNF: boolean = false;

  acaoFormulario: 'atualizarFornecedor' | 'cadastrarFornecedor' | 'cadastrarNFE' = 'cadastrarFornecedor';

  modalRef!: BsModalRef;

  constructor(
    private fornecedorService: FornecedorService,
    private modalService: BsModalService,
    private notaFiscalService: NotaFiscalService,
    private notaFiscalComponent: NotaFiscalComponent
  ) {}

  ngOnInit(): void {
    this.carregarFornecedores();
    this.carregarNotasFiscais();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedor().subscribe((resultado) => {
      this.fornecedores = resultado;
    });
  }

  carregarNotasFiscais(): void {
    this.notaFiscalService.getNotasFiscais().subscribe((resultado) => {
      this.notasFiscais = resultado;
    });
  }

  exibirFormularioCadastro(): void {
    this.acaoFormulario = 'cadastrarFornecedor'
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.visibilidadeFormularioNF = false;
    this.tituloFormulario = 'Novo Fornecedor';
    this.formulario = new FormGroup({
      nomeFantasia: new FormControl(null),
      cnpj: new FormControl(null)
    });
  }

  exibirFormularioAtualizacao(fornecedorId: number): void {
    this.acaoFormulario = 'atualizarFornecedor';
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.visibilidadeFormularioNF = false;

    this.fornecedorService.getFornecedorById(fornecedorId).subscribe((resultado) => {
      this.tituloFormulario = `Atualizar Fornecedor: ${resultado.nomeFantasia}`;
      this.formulario = new FormGroup({
        fornecedorId: new FormControl(resultado.fornecedorId),
        nomeFantasia: new FormControl(resultado.nomeFantasia),
        cnpj: new FormControl(resultado.cnpj)
      });
    });
  }

  enviarFormulario(): void {

    if (this.acaoFormulario === 'atualizarFornecedor') {
      const fornecedor: Fornecedor = this.formulario.value;
      if (fornecedor.fornecedorId) {
        this.fornecedorService.updateFornecedor(fornecedor.fornecedorId, fornecedor).subscribe(() => {
          this.visibilidadeFormulario = false;
          this.visibilidadeFormularioNF = false;
          this.visibilidadeTabela = true;
          alert('Fornecedor atualizado com sucesso!');
          this.carregarFornecedores();
        });
      }
    } else if (this.acaoFormulario === 'cadastrarFornecedor') {
      const fornecedor: Fornecedor = this.formulario.value;
      this.fornecedorService.postFornecedor(fornecedor).subscribe(() => {
        this.visibilidadeFormulario = false;
        this.visibilidadeFormularioNF = false;
        this.visibilidadeTabela = true;
        alert('Fornecedor cadastrado com sucesso!');
        this.carregarFornecedores();
      });
    } else if (this.acaoFormulario === 'cadastrarNFE') {

      const notaFiscal: NotaFiscal = this.nfE.value;
  
      this.notaFiscalService.postNotaFiscal(notaFiscal).subscribe(() => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        this.visibilidadeFormularioNF = false;
        alert('Nota Fiscal cadastrada com sucesso!');
      });
    }
  }
  
  voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
    this.visibilidadeFormularioNF = false;
  }

  exibirConfirmacaoExclusao(fornecedorId: number, conteudoModal: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.fornecedorId = fornecedorId;
  }

  excluirFornecedor(): void {
    this.fornecedorService.deleteFornecedor(this.fornecedorId).subscribe(() => {
      this.modalRef.hide();
      alert('Fornecedor excluído com sucesso!');
      this.carregarFornecedores();
    });
  }

  emitirNotaFiscal(fornecedorId: number, cnpjDestinatario: string): void {
    this.acaoFormulario = 'cadastrarNFE';
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = false;
    this.visibilidadeFormularioNF = true;
    this.tituloFormulario = 'Nova Nota Fiscal';

    const numeroNotaGerado = this.notasFiscais.length + 1;
    const numeroNotaFormatado = numeroNotaGerado.toString().padStart(3, '0');

    this.nfE = new FormGroup({
      numeroNota: new FormControl(numeroNotaFormatado),
      dataEmissao: new FormControl(null),
      valorTotal: new FormControl(null),
      cnpjEmitente: new FormControl(null),
      cnpjDestinatario: new FormControl(cnpjDestinatario)
    });

  }
}
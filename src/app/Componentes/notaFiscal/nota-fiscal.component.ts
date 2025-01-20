import { Component, Injectable, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotaFiscalService } from '../../Pages/NotaFiscal/nota-fiscal.service';
import { NotaFiscal } from '../../Pages/NotaFiscal/NotaFiscal';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root' // Isso garante que o serviço está disponível globalmente
})

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './nota-fiscal.component.html',
  styleUrls: ['./nota-fiscal.component.css'],
  providers: [provideNgxMask()]
})
export class NotaFiscalComponent implements OnInit {
  nfE!: FormGroup;
  tituloFormulario!: string;
  notasFiscais: NotaFiscal[] = [];
  notaFiscalId!: number;
  numeroNota!: number;

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;

  modalRef!: BsModalRef;

  constructor(
    private notaFiscalService: NotaFiscalService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.carregarNotasFiscais();
  }

  carregarNotasFiscais(): void {
    this.notaFiscalService.getNotasFiscais().subscribe((resultado) => {
      this.notasFiscais = resultado;
    });
  }

  exibirFormularioCadastroNF(): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.tituloFormulario = 'Nova Nota Fiscal';

    const numeroNotaGerado = this.notasFiscais.length + 1;
    const numeroNotaFormatado = numeroNotaGerado.toString().padStart(3, '0');

    this.nfE = new FormGroup({
      numeroNota: new FormControl(numeroNotaFormatado),
      dataEmissao: new FormControl(null),
      valorTotal: new FormControl(null),
      cnpjEmitente: new FormControl(null),
      cnpjDestinatario: new FormControl(null)
    });
  }

  exibirFormularioAtualizacao(notaFiscalId: number): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
  
    this.notaFiscalService.getNotaFiscalById(notaFiscalId).subscribe((resultado) => {
      this.tituloFormulario = `Atualizar Nota Fiscal: ${resultado.numeroNota}`;
  
      const dataEmissaoFormatada = new Date(resultado.dataEmissao).toISOString().split('T')[0];
  
      this.nfE = new FormGroup({
        id: new FormControl(resultado.id),
        numeroNota: new FormControl(resultado.numeroNota),
        dataEmissao: new FormControl(dataEmissaoFormatada),
        valorTotal: new FormControl(resultado.valorTotal),
        cnpjEmitente: new FormControl(resultado.cnpjEmitente),
        cnpjDestinatario: new FormControl(resultado.cnpjDestinatario),
      });
    });
  }
  

  enviarFormulario(): void {
    const notaFiscal: NotaFiscal = this.nfE.value;

    if (notaFiscal.id) {
      // Atualização de nota fiscal
      this.notaFiscalService.updateNotaFiscal(notaFiscal.id, notaFiscal).subscribe(() => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Nota Fiscal atualizada com sucesso!');
        this.carregarNotasFiscais();
      });
    } else {
      // Cadastro de nova nota fiscal
      this.notaFiscalService.postNotaFiscal(notaFiscal).subscribe(() => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Nota Fiscal cadastrada com sucesso!');
        this.carregarNotasFiscais();
      });
    }
  }

  voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
  }

  exibirConfirmacaoExclusao(notaFiscalId: number, conteudoModal: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.notaFiscalId = notaFiscalId;
  }

  excluirNotaFiscal(): void {
    this.notaFiscalService.deleteNotaFiscal(this.notaFiscalId).subscribe(() => {
      this.modalRef.hide();
      alert('Nota Fiscal excluída com sucesso!');
      this.carregarNotasFiscais();
    });
  }
}

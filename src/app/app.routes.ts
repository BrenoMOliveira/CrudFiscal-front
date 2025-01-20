import { Routes } from '@angular/router';
import { FornecedorComponent } from './Componentes/fornecedor/fornecedor.component';
import { NotaFiscalComponent } from './Componentes/notaFiscal/nota-fiscal.component';

export const routes: Routes = [
    { path: '', component: FornecedorComponent }, // Rota inicial (sem mostrar '/Fornecedores')
    { path: 'NotasFiscais', component: NotaFiscalComponent }, // Nova rota para Notas Fiscais
    { path: 'NotasFiscais/:fornecedorId', component: NotaFiscalComponent },
    { path: '**', redirectTo: '' } // Redireciona rotas inválidas para a página inicial
  ];
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { FornecedorService } from './app/Pages/Fornecedores/fornecedor.service';
import { NotaFiscalService } from './app/Pages/NotaFiscal/nota-fiscal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]),
    HttpClient,
    FornecedorService,
    NotaFiscalService,
    ReactiveFormsModule,
    provideNgxMask()  
  ]
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

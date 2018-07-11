import { NgModule } from '@angular/core';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    DateFormatPipe,
  ],
  providers: [
    DateFormatPipe,
  ],
  exports: [
      DateFormatPipe
  ]
})
export class UtilityModule {

}
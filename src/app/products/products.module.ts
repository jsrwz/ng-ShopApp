import { NgModule } from "@angular/core";
import { ProductCreateComponent } from "./product-create/product-create.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductComponent } from "./product/product.component";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AdminGuard } from "../authentication/admin.guard";
import { AuthenticationModule } from "../authentication/authentication.module";

const routes: Routes = [
    {
        path: "",
        children: [
            { path: 'create', component: ProductCreateComponent, canActivate: [AdminGuard]},
            { path: ':productId', component: ProductComponent },
            { path: 'category/:categoryId', component: ProductListComponent},
            { path: '', component: ProductListComponent },
        ]
    }
]

@NgModule({
    declarations: [
        ProductListComponent,
        ProductComponent,
        ProductCreateComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        AuthenticationModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        ProductListComponent,
        ProductComponent,
        ProductCreateComponent
    ]
})

export class ProductsModule {

}
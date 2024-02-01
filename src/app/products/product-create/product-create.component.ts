import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../categories/category.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  providers: [CategoryService]
})
export class ProductCreateComponent implements OnInit {

  categories: Category[] = []
  error: string = ""
  model: any = {}
  constructor(
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data
    })
  }

  saveProduct(form: NgForm) {

    //image url uzantı kontrolü
    const extensions = ["jpeg", "jpg", "png"]
    const extension = this.model.imageUrl.split(".").pop()
    if (extensions.indexOf(extension) == -1) {
      this.error = "Resim uzantısı sadece jpeg,jpg,png olmalıdır!"
      return
    }

    if (this.model.categoryId == "0") {
      this.error = "Kategori seçmelisiniz"
      return
    }

    const product = {
      id: 1,
      name: this.model.name,
      price: this.model.price,
      imageUrl: this.model.imageUrl,
      description: this.model.description,
      isActive: this.model.isActive,
      categoryId: this.model.categoryId
    }

    if (form.valid) {
      this.productService.createProduct(product).subscribe(data => {
        this.router.navigate(['/products'])
      })
    } else {
      this.error = "Formu kontrol ediniz."
    }

  }

}

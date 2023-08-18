import {Component, DestroyRef, inject, OnInit,} from '@angular/core';
import Chart from 'chart.js/auto';
import {ProductsService} from '../../share/service/products.service';
import {IChartDatasets, IList, IPagination, IProduct} from '../../share/interfaces';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public destroyed = inject(DestroyRef);
  public chartRating: any;
  public chartPrice: any;
  public chartProductStock: any;
  public chartCategoryStock: any;
  public groupedProducts: Record<string, number[]> = {};
  public categoryList: string[] = [];
  public groupedTitlesList: string[] = [];

  public stockProduct: number[] = [];
  public ratingProduct: number[] = [];
  public groupedTitlesPrice: number[] = [];
  public groupedProductStock: number[] = [];

  public categoryStockDatasets: IChartDatasets[] = [];
  public productDatasets: IChartDatasets[] = [];

  public loader: boolean = false;
  public pagination: IPagination = {
    limit: 20,
    skip: 0
  };

  constructor(private productsService: ProductsService) {
  }

  public ngOnInit() {
    this.fetch();
  }

  public fetch() {
    this.loader = true;
    if (this.chartProductStock) {
    this.destroyCharts();
    }
    this.productsService.getProducts(this.pagination.skip, this.pagination.limit).pipe(
      takeUntilDestroyed(this.destroyed)
    ).subscribe((res: IList) => {
      this.groupProductsByCategory(res.products);
      this.groupProductsByRate(res.products);
      this.groupProductsByBrand(res.products);
      this.groupProductsByProductStock(res.products);
      this.createChart();
    });
  }


  public destroyCharts() {
    this.chartRating.destroy();
    this.chartPrice.destroy();
    this.chartProductStock.destroy();
    this.chartCategoryStock.destroy();
  }

  public groupProductsByCategory(products: IProduct[]) {
    this.stockProduct = [];
      this.groupedProducts = products.reduce((acc, curr) => {
      const category = curr.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(curr.stock);
      return acc;
    }, {} as Record<string, number[]>);


    const categoryCounts: Record<string, number> = {};
    for (const category in this.groupedProducts) {
      if (this.groupedProducts.hasOwnProperty(category)) {
        const countArray = this.groupedProducts[category];
        const totalCount = countArray.reduce((acc, curr) => acc + curr, 0);
        categoryCounts[category] = totalCount;
        this.stockProduct.push(totalCount);
      }
    }
    this.categoryStockDatasets = [
      {
        label: "Category Stock",
        data: this.stockProduct,
        backgroundColor: 'blue'
      },
    ];
    this.categoryList = Object.keys(categoryCounts)
  }

  public groupProductsByBrand(products: IProduct[]) {
    this.groupedTitlesList = [];
    this.groupedTitlesPrice = [];
    products.forEach(res => {
      this.groupedTitlesList.push(res.title);
      this.groupedTitlesPrice.push(res.price);
    });

    this.productDatasets = [
      {
        label: "Price",
        data: this.groupedTitlesPrice,
        backgroundColor: 'pink'
      },
    ]
  }

  public groupProductsByProductStock(products: IProduct[]) {
    this.groupedProductStock = [];
    products.forEach(res => {
      this.groupedProductStock.push(res.stock);
    })
  }

  public groupProductsByRate(rate: IProduct[]) {
    this.ratingProduct = [];
    const rateList = rate.reduce((acc, curr) => {
      const category = curr.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(curr.rating);
      return acc;
    }, {} as Record<string, number[]>);

    for (const category in rateList) {
      if (rateList.hasOwnProperty(category)) {
        const ratings = rateList[category];
        const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
        const middleRate = totalRatings / ratings.length;
        this.ratingProduct.push(middleRate);
      }
    }
  }

  public createChart() {
    this.chartCategoryStock = new Chart('ChartStock', {
      type: 'line',
      data: {
        labels: this.categoryList,
        datasets: this.categoryStockDatasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.chartProductStock = new Chart('ChartProductStock', {
      type: 'line',
      data: {
        labels: this.groupedTitlesList,
        datasets: [
          {
            label: "Product Stock",
            data: this.groupedProductStock,
            backgroundColor: 'red'
          },
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.chartPrice = new Chart('ChartPrice', {
      type: 'line',
      data: {
        labels: this.groupedTitlesList,
        datasets: this.productDatasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.chartRating = new Chart('ChartRating', {
      type: 'line',
      data: {
        labels: this.categoryList,
        datasets: [
          {
            label: "Rating",
            data: this.ratingProduct,
            backgroundColor: 'green'
          },
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.categoryStockDatasets.length > 1 ? this.chartRating.destroy() : null;
    this.productDatasets.length > 1 ? this.chartProductStock.destroy() : null;
    this.loader = false;
  }

  public changeDataCount(event: number) {
    this.pagination.limit = event;
    this.productDatasets = [
      {
        label: "Price",
        data: this.groupedTitlesPrice,
        backgroundColor: 'pink'
      },
    ];
    this.categoryStockDatasets = [
      {
        label: "Category Stock",
        data: this.stockProduct,
        backgroundColor: 'blue'
      },
    ];
    this.fetch();
  }

  public combineChart(type: string) {
    this.destroyCharts();
    switch (type) {
      case '0':
        this.categoryStockDatasets.push(
          {
            label: "Rating",
            data: this.ratingProduct,
            backgroundColor: 'green'
          },
        );
        break;
      case '1':
        this.productDatasets.push(
          {
            label: "Product Stock",
            data: this.groupedProductStock,
            backgroundColor: 'red'
          },
        );
        break;
    }
    this.createChart();

  }
}

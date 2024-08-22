package fpoly.datn.ecommerce_website.restController.client;

import fpoly.datn.ecommerce_website.dto.FullProductDTO;
import fpoly.datn.ecommerce_website.dto.ProductDTO;
import fpoly.datn.ecommerce_website.entity.Products;
import fpoly.datn.ecommerce_website.repository.IProductRepository;
import fpoly.datn.ecommerce_website.service.IProductService;
import fpoly.datn.ecommerce_website.service.serviceImpl.FullProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FullProductController {

    @Autowired
    private FullProductServiceImpl productService;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IProductService iProductService;

    @GetMapping("/all-products/")
    public ResponseEntity<List<FullProductDTO>> getAllFullProducts() {
        List<FullProductDTO> fullProducts = productService.getAllFullProducts();
        return ResponseEntity.ok(fullProducts);
    }

    @GetMapping("/products/getall/pagination")
    public ResponseEntity<List<ProductDTO>> getAllProduct() {
        List<ProductDTO> fullProducts = this.iProductService.findAll();
        return ResponseEntity.ok(fullProducts);
    }


    @GetMapping("/detail-product/{id}")
    public ResponseEntity<?> listSanPhamChiTiet(@PathVariable String id) {
        FullProductDTO productDetail = productService.findByListProductDetailById(id);

        if (productDetail != null) {
            return ResponseEntity.ok(productDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getOne-product/{id}")
    public ResponseEntity<?> sanPhamChiTiet(@PathVariable String id) {
        FullProductDTO productDetail = productService.findByProductDetailById(id);

        if (productDetail != null) {
            return ResponseEntity.ok(productDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Products>> searchProducts(
            @RequestParam String keyword
    ) {
        List<Products> foundProducts;

        // Gọi phương thức tìm kiếm sản phẩm từ service
        if (keyword != null) {
            foundProducts = productService.searchProducts(keyword);
        } else {
            // Nếu không có yêu cầu tìm kiếm cụ thể, có thể trả về tất cả sản phẩm
            foundProducts = productRepository.findAll();
        }
        // Trả về danh sách sản phẩm tìm thấy
        return ResponseEntity.ok(foundProducts);
    }

}

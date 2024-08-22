package fpoly.datn.ecommerce_website.dto;

import fpoly.datn.ecommerce_website.entity.Brands;
import fpoly.datn.ecommerce_website.entity.Images;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder

public class ProductDTO {

    private String productId;

    private String productCode;

    private String productName;

    private Integer productStatus;

    private Brands brand;
    private List<Images> images;
    private List<ProductDetails> productDetails;
}

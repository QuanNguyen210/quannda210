package fpoly.datn.ecommerce_website.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class FullProductDTO {

    private String productId;

    private String productCode;

    private String productName;

    private String brandName;

    private ImageDTO1 img;

    private ProductDetailDTO1 productDetail;

    private List<ImageDTO1> imgs;

    private List<ProductDetailDTO1> productDetails;


}

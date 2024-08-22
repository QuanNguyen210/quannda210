package fpoly.datn.ecommerce_website.dto;

import fpoly.datn.ecommerce_website.entity.Products;
import fpoly.datn.ecommerce_website.entity.Products_ProductDetails;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageDTO {
    private String imageId;
    private String imgCode;
    private String imgName;
    private String imgUrl;
    private Boolean isPrimary;
    private Products_ProductDetails products;
}

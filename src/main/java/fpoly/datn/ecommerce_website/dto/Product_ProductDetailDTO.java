package fpoly.datn.ecommerce_website.dto;

import fpoly.datn.ecommerce_website.entity.Products;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Product_ProductDetailDTO {


    private String colorId;
    private String typeId;
    private String materialId;
    private String sizeId;
    private String brandId;
    private String compartmentId;
    private String buckleTypeId;
    private String producerId;
    private Products products;

    private Float importPrice;

    private Float retailPrice;

    private Integer amount;

    private String describe;

    private Integer productDetailStatus;


}

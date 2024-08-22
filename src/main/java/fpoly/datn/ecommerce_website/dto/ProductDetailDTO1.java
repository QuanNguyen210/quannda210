package fpoly.datn.ecommerce_website.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductDetailDTO1 {
    private String productDetailId;
    private BigDecimal importPrice;
    private BigDecimal retailPrice;
    private String colorId;
    private String colorName;
    private String typeName;
    private String materialName;
    private String sizeName;
    private String sizeWidth;
    private String sizeHeight;
    private String sizeLength;
    private String producerName;
    private String compartmentName;
    private String buckleTypeName;
    private String describe;
    private Integer amount;
    private Integer productDetailAmount;
    private String productDetailDescribe;
    private Integer productDetailStatus;
}

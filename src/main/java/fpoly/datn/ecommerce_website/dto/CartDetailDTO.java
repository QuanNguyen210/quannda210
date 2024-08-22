package fpoly.datn.ecommerce_website.dto;

import fpoly.datn.ecommerce_website.entity.Carts;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CartDetailDTO {
    private String cartDetailId;
    private Carts carts;
    private ProductDetails productDetails;
    private int amount;
}
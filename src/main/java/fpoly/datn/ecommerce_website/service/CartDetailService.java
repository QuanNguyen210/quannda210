package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.dto.CartDetailDTO;
import fpoly.datn.ecommerce_website.entity.CartDetails;

import java.util.List;

public interface CartDetailService {

    List<CartDetails> getAll();

    CartDetailDTO addToCart(CartDetailDTO cartDetailDTO);

    CartDetails updateAmountToCart(String id,int amount);

    Boolean delete(String id);

    Boolean deleteAllCartDetail(String cartId);



}

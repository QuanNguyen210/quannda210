package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.dto.BillDetailsDTO;
import fpoly.datn.ecommerce_website.dto.CartDetailDTO;
import fpoly.datn.ecommerce_website.dto.SizeDTO;
import fpoly.datn.ecommerce_website.entity.CartDetails;
import fpoly.datn.ecommerce_website.entity.Carts;
import fpoly.datn.ecommerce_website.entity.Colors;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import fpoly.datn.ecommerce_website.entity.Sizes;
import fpoly.datn.ecommerce_website.repository.ICartDetailRepository;
import fpoly.datn.ecommerce_website.repository.ICartRepository;
import fpoly.datn.ecommerce_website.repository.IProductDetailRepository;
import fpoly.datn.ecommerce_website.service.CartService;
import fpoly.datn.ecommerce_website.service.serviceImpl.CartDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CartDetailRescontroller {

    @Autowired
    private CartDetailServiceImpl cartDetailService;
    @Autowired
    private ICartRepository iCartRepository;

    @Autowired
    private IProductDetailRepository iProductDetailRepository;

    @GetMapping("/cart-detail/")
    public ResponseEntity<List<CartDetails>> getAllCartDetails() {
        List<CartDetails> cartDetails = cartDetailService.getAll();
        return new ResponseEntity<>(cartDetails, HttpStatus.OK);
    }


    @PostMapping("/cart-detail")
    public ResponseEntity<CartDetailDTO> addCartDetail(@RequestBody CartDetailDTO cartDetailDTO) {
        CartDetailDTO addedCartDetail = cartDetailService.addToCart(cartDetailDTO);
        return new ResponseEntity<>(addedCartDetail, HttpStatus.OK);
    }

    @PutMapping("/cart-detail/{cartDetailId}")
    public ResponseEntity<?> updateCartDetailAmount(@PathVariable("cartDetailId") String cartDetailId,
                                                                @RequestParam("amount") Integer amount) {
        cartDetailService.updateAmountToCart(cartDetailId, amount);
    return new ResponseEntity<>(cartDetailService.updateAmountToCart(cartDetailId, amount),HttpStatus.OK);
    }


    @DeleteMapping("/cart-detail/{cartDetailId}")
    public ResponseEntity<String> delete(@PathVariable("cartDetailId") String cartDetailId) {
        Boolean isDeleted = cartDetailService.delete(cartDetailId);

        if (isDeleted != null && isDeleted) {
            return ResponseEntity.ok("Deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/all-cart-detail/{cartId}")
    public ResponseEntity<String> deleteAllCartDetailsByCartId(@PathVariable String cartId) {
        boolean deleted = cartDetailService.deleteAllCartDetail(cartId);
        if (deleted) {
            return ResponseEntity.ok("Deleted all CartDetails for cartId: " + cartId);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No CartDetails found for cartId: " + cartId);
    }


}








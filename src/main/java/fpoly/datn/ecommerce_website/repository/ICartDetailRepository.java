package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.entity.CartDetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICartDetailRepository extends JpaRepository<CartDetails, String> {

    @Query("SELECT cdt FROM CartDetails cdt WHERE cdt.carts.cartId = :cartId")
    List<CartDetails> findByCartId(String cartId);

}

package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.entity.Carts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface ICartRepository extends JpaRepository<Carts, String> {

    @Query("select c from Carts c  " +
            "where c.customers.customerId=:customerId")
    Carts getAllCartsByCustomerId(@Param("customerId") String customerId);
}

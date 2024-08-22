package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.model.request.FindUserRequest;
import fpoly.datn.ecommerce_website.model.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<Users, String> {

    @Query("SELECT u FROM Users u join Customers c on c.users.userId = u.userId ")
    List<Users> findCustomerByKeyword(@Param("keyword") String keyword);

    @Query("SELECT i FROM Users i")
    Page<Users> findAllAccountPhanTrang(Pageable pageable);

    Users findByEmail(String email);

    Optional<Users> findByAccount(String username);

}

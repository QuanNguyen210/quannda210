package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
    public interface ICustomerRepository extends JpaRepository<Customers, String> {

        @Query(value = "SELECT c FROM  Customers  c")
        Page<Customers> findAllCustomersWithUsersRoles(Pageable pageable);

    @Query (value = "SELECT c FROM Customers c  " +
            "where ( c.users.account like %:keyword% " +
            "or c.users.address like %:keyword% " +
            " or c.users.fullName like %:keyword% " +
            " or c.customerCode like %:keyword% " +
            " or c.users.email like %:keyword% " +
            " or c.users.phoneNumber like %:keyword% ) " +
            " AND ( :status IS NULL OR c.customerStatus = :status ) " +
            " AND ( :gender IS NULL OR c.users.gender = :gender ) " +
            " AND ( :ranking IS NULL OR c.customerRanking = :ranking ) "
            )
    Page<Customers> findallSearch(
            @Param("keyword") String keyword,
            @Param ("status") Integer status,
            @Param ("gender") Boolean gender,
            @Param ("ranking") Ranking ranking,
            Pageable pageable);
//    @Query("SELECT c FROM Customers c join Users u on c.users.userId = u.userId " +
//            "where c.customerId LIKE %:keyword%" +
//            "or  u.userId LIKE %:keyword%" +
//            "or u.fullName LIKE %:keyword%" +
//            "or u.account LIKE %:keyword%" +
//            "or u.email LIKE %:keyword%" +
//            "or u.phoneNumber LIKE %:keyword%")
//    List<Customers> findByKeyword(String keyword);
@Query("SELECT c FROM Customers c join Users u on c.users.userId = u.userId ")
List<Customers> findByKeyword(String keyword);
    @Query("SELECT c FROM Customers c " +
            "where c.customerStatus = 1 AND  (( :keyword is null or c.users.fullName LIKE %:keyword% ) " +
            " OR  ( :keyword is null or c.users.phoneNumber LIKE %:keyword% ) " +
            "OR  ( :keyword is null or c.customerCode LIKE %:keyword% ) " +
            "OR ( :keyword is null or c.users.email LIKE %:keyword% )) ")
    List<Customers> findCustomerByKeyword(@Param("keyword") String keyword);

    @Query("SELECT c, u FROM Customers c join Users u on c.users.userId = u.userId " +
            "where u.email = :email ")
    Customers findByEmail(@Param("email") String email);

    @Query("SELECT c, u FROM Customers c join Users u on c.users.userId = u.userId " +
            "where u.phoneNumber = :phoneNumber ")
    Customers findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT c, u FROM Customers c join Users u on c.users.userId = u.userId " +
            "where u.userId = :userId ")
    Customers findByUsersId(@Param("userId") String userId);
}

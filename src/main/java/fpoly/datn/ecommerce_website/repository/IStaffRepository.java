package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.entity.Customers;
import fpoly.datn.ecommerce_website.entity.Staffs;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface IStaffRepository extends JpaRepository<Staffs, String> {

    @Query(value = " SELECT c FROM Staffs c " +
            " where ( c.users.account like %:search% " +
//            " or c.users.address like %:search% " +
            " or c.users.fullName like %:search% " +
            " or c.users.phoneNumber like %:search% " +
            " or c.users.email like %:search% " +
            " OR c.staffCode like %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR c.staffStatus = :status ) " +
            " AND ( :gender IS NULL OR c.users.gender = :gender ) " +
            " AND ( :role IS NULL OR c.users.role = :role ) "
    )
    Page<Staffs> getAllPage(@Param("search")  String search,
                            @Param ("status") Integer status,
                            @Param ("gender") Boolean gender,
                               @Param ("role") Role role,
                               Pageable pageable);

//    @Query(value = " SELECT c FROM Staffs c " +
//            " where ( c.users.account like %:search% " +
//            " or c.users.address like %:search% " +
//            " or c.users.fullName like %:search% " +
//            " or c.users.phoneNumber like %:search% " +
//            " or c.users.address like %:search% " +
//            " OR c.staffCode like %:search% " +
//            " or :search IS NULL ) " +
//            " AND ( :status IS NULL OR c.staffStatus = :status ) " +
//            " AND ( :gender IS NULL OR c.users.gender = :gender ) " +
//            " AND ( :role IS NULL OR c.users.role like %:role% ) "
//    )
//    Page<Staffs> findallSearch(@Param("search")  String search,
//                               @Param("gender")  Boolean gender,
//                               @Param("role")  String role,
//                               @Param("status")  Integer status,
//                               Pageable pageable);

    @Query("SELECT s, u FROM Staffs s join Users u on s.users.userId = u.userId " +
            "where u.email = :email ")
    Staffs findByEmail(@Param("email") String email);

    @Query("SELECT c, u FROM Staffs c join Users u on c.users.userId = u.userId " +
            "where u.phoneNumber = :phoneNumber ")
    Staffs findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT s, u FROM Staffs s join Users u on s.users.userId = u.userId " +
            "where u.userId = :userId ")
    Staffs findByUsersId(@Param("userId") String userId);
//    @Query("SELECT s, u FROM Staffs s join Users u on s.users.userId = u.userId " +
//            "where u.email = :email ")
//    Staffs findByEmail(@Param("email") String email);


}

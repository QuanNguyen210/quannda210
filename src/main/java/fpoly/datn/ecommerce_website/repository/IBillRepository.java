package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.dto.BillsDTO;
import fpoly.datn.ecommerce_website.dto.BillsQDTO;
import fpoly.datn.ecommerce_website.dto.TopCustomersDTO;
import fpoly.datn.ecommerce_website.entity.BillDetails;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface IBillRepository extends JpaRepository<Bills, String> {


    // getAll bill  với tất cả đơn hàng
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) "
    )
    Page<Bills> findAllBills(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với tất cả đơn hàng của customerId
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) "

    )
    Page<Bills> findAllBillsCustomerId(
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) "

    )
    Page<Bills> findAllBillsCustomerRanking(
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) "
    )
    Page<Bills> findAllBillsCustomerRankingAndCustomerId(
            @Param("customerId") String customerId,
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với hạng khách hàng lẻ
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND b.customer IS NULL "
    )
    Page<Bills> findAllBillsKhachHangLe(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getAll bill khi lọc cả nhân viên

    // Tất cả hóa đơn
    // getAll bill  với tất cả đơn hàng
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) "
    )
    Page<Bills> findAllBillsOfStaff(
            @Param("staffId") String staffId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với tất cả đơn hàng của customerId
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) "

    )
    Page<Bills> findAllBillsCustomerIdOfStaff(
            @Param("staffId") String staffId,
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) "

    )
    Page<Bills> findAllBillsCustomerRankingOfStaff(
            @Param("staffId") String staffId,
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) "
    )
    Page<Bills> findAllBillsCustomerRankingAndCustomerIdOfStaff(
            @Param("staffId") String staffId,
            @Param("customerId") String customerId,
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với hạng khách hàng lẻ
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND b.customer IS NULL " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) "
    )
    Page<Bills> findAllBillsKhachHangLeOfStaff(
            @Param("staffId") String staffId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);





    ///////////////////////////////////////////////////// Hóa đơn online


    // getAll bill online với tất cả đơn hàng
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND b.staff IS NULL "
    )
    Page<Bills> findAllBillsOnline(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill online với tất cả đơn hàng của customerId
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND b.staff IS NULL "
    )
    Page<Bills> findAllBillsOnlineCustomerId(
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill online với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND b.staff IS NULL "
    )
    Page<Bills> findAllBillsOnlineCustomerRanking(
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill online với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND b.staff IS NULL "
    )
    Page<Bills> findAllBillsOnlineCustomerRankingAndCustomerId(
            @Param("customerId") String customerId,
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill online với hạng khách hàng lẻ
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND b.customer IS NULL " +
            " AND b.staff IS NULL "
    )
    Page<Bills> findAllBillsOnlineKhachHangLe(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);


    ////////////////////////////////////////////////////////////////////// Get bill offline

    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND b.staff IS NOT NULL "
    )
    Page<Bills> findAllBillsOffline(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với tất cả đơn hàng của customerId
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND b.staff IS NOT NULL "

    )
    Page<Bills> findAllBillsCustomerIdOffline(
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND b.staff IS NOT NULL "

    )
    Page<Bills> findAllBillsCustomerRankingOffline(
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND b.staff IS NOT NULL "
    )
    Page<Bills> findAllBillsCustomerRankingAndCustomerIdOffline(
            @Param("customerId") String customerId,
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với hạng khách hàng lẻ
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND b.customer IS NULL " +
            " AND b.staff IS NOT NULL "
    )
    Page<Bills> findAllBillsKhachHangLeOffline(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // Tất cả hóa đơn
    // getAll bill  với tất cả đơn hàng
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) " +
            " AND b.staff IS NOT NULL "
    )
    Page<Bills> findAllBillsOfStaffOffline(
            @Param("staffId") String staffId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với tất cả đơn hàng của customerId
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) " +
            " AND b.staff IS NOT NULL "

    )
    Page<Bills> findAllBillsCustomerIdOfStaffOffline(
            @Param("staffId") String staffId,
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) " +
            " AND b.staff IS NOT NULL "

    )
    Page<Bills> findAllBillsCustomerRankingOfStaffOffline(
            @Param("staffId") String staffId,
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với khách hàng đã đăng nhập
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( :customerRanking IS NULL OR b.customer.customerRanking = :customerRanking ) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) " +
            " AND b.staff IS NOT NULL "
    )
    Page<Bills> findAllBillsCustomerRankingAndCustomerIdOfStaffOffline(
            @Param("staffId") String staffId,
            @Param("customerId") String customerId,
            @Param("customerRanking") Ranking customerRanking,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // getAll bill với hạng khách hàng lẻ
    @Query(value = " SELECT b FROM Bills b WHERE " +
            " ( b.billCode LIKE %:search% " +
            " OR b.orderPhone LIKE %:search% " +
            " OR CAST(b.billPriceAfterVoucher AS string) like %:search% " +
            " OR b.receiverName LIKE %:search% " +
            " or :search IS NULL ) " +
            " AND ( :status IS NULL OR b.billStatus = :status ) " +
            " AND (b.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND b.customer IS NULL " +
            " AND ( :staffId IS NULL OR b.staff.staffId = :staffId ) " +
            " AND b.staff IS NOT NULL "
    )
    Page<Bills> findAllBillsKhachHangLeOfStaffOffline(
            @Param("staffId") String staffId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);


    // getAll bill với tất cả đơn hàng của customerId
    @Query(value = " SELECT b FROM Bills b WHERE " +
            "  ( :status IS NULL OR b.billStatus = :status ) " +
            " AND ( :customerId IS NULL OR b.customer.customerId = :customerId ) "
    )
    Page<Bills> findAllBillsCustomer(
            @Param("customerId") String customerId,
            @Param("status") Integer status,
            Pageable pageable);




    @Query("SELECT COALESCE(SUM(b.billTotalPrice), 0) FROM Bills b WHERE CAST(b.billCreateDate AS date) = CAST(:date AS date)")
    BigDecimal calculateTotalSalesForDate(@Param("date") LocalDate date);



    ////////////////////////////////// Thống kê

    List<Bills> findByBillCreateDateBetween(Date startDate, Date endDate);

    @Query("SELECT SUM(b.billPriceAfterVoucher) FROM Bills b WHERE " +
            " b.billStatus <> -1 " +
            " AND ( b.billCreateDate BETWEEN :startDate AND :endDate ) "
    )
    BigDecimal calculateTotalPrice(@Param("startDate") Date startDate,
                                   @Param("endDate") Date endDate);
    @Query("SELECT SUM(b.billPriceAfterVoucher) FROM Bills b WHERE " +
            " b.billStatus <> -1 AND b.staff IS NOT NULL " +
            " AND ( b.billCreateDate BETWEEN :startDate AND :endDate ) "
    )
    BigDecimal calculateTotalPriceOffline(@Param("startDate") Date startDate,
                                   @Param("endDate") Date endDate);
    @Query("SELECT SUM(b.billPriceAfterVoucher) FROM Bills b WHERE " +
            " b.billStatus <> -1 AND b.staff IS NULL " +
            " AND ( b.billCreateDate BETWEEN :startDate AND :endDate ) "
    )
    BigDecimal calculateTotalPriceOnline(@Param("startDate") Date startDate,
                                          @Param("endDate") Date endDate);

    @Query("SELECT SUM(b.billPriceAfterVoucher) FROM Bills b WHERE " +
            " b.billStatus <> -1 " +
            " AND DAY(b.billCreateDate) <= DAY(CURRENT_DATE) " +
            " AND MONTH(b.billCreateDate) = MONTH(CURRENT_DATE) " +
            " AND YEAR(b.billCreateDate) = YEAR(CURRENT_DATE) ")
    BigDecimal calculateTotalPriceThisMonth();

    @Query("SELECT SUM(b.billPriceAfterVoucher) FROM Bills b WHERE " +
            " ( b.billStatus <> -1 AND DAY(b.billCreateDate) <= DAY(CURRENT_DATE) AND MONTH(CURRENT_DATE) = 1 AND (MONTH(b.billCreateDate) = 12 AND YEAR(b.billCreateDate) = YEAR(CURRENT_DATE) -1 AND b.billCreateDate <= CURRENT_DATE)) " +
            " OR ( b.billStatus <> -1 AND DAY(b.billCreateDate) <= DAY(CURRENT_DATE) AND MONTH(CURRENT_DATE) > 1 AND (MONTH(b.billCreateDate) = MONTH(CURRENT_DATE) - 1 AND YEAR(b.billCreateDate) = YEAR(CURRENT_DATE) AND b.billCreateDate <= CURRENT_DATE)) "
    )
    BigDecimal calculateTotalPriceLastMonth();

    @Query("SELECT SUM(b.billPriceAfterVoucher) FROM Bills b WHERE " +
            " ( b.billStatus <> -1 AND MONTH(CURRENT_DATE) = 1 AND (MONTH(b.billCreateDate) = 12 AND YEAR(b.billCreateDate) = YEAR(CURRENT_DATE) -1 AND b.billCreateDate <= CURRENT_DATE)) " +
            " OR ( b.billStatus <> -1 AND MONTH(CURRENT_DATE) > 1 AND (MONTH(b.billCreateDate) = MONTH(CURRENT_DATE) - 1 AND YEAR(b.billCreateDate) = YEAR(CURRENT_DATE) AND b.billCreateDate <= CURRENT_DATE)) "
    )
    BigDecimal calculateTotalPriceLastMonthByAll();

    @Query(" SELECT FORMAT(b.billCreateDate, 'yyyy-MM-dd') AS formatted_date, " +
            " SUM(b.billPriceAfterVoucher) " +
            " FROM Bills b " +
            " WHERE b.billStatus <> -1 " +
            " AND MONTH(b.billCreateDate) = :month " +
            " AND YEAR(b.billCreateDate) = :year " +
            " GROUP BY FORMAT(b.billCreateDate, 'yyyy-MM-dd') " )
    List<Object[]> findTotalPricesByDay(@Param("month") String month, @Param("year") String year);

    @Query("SELECT NEW fpoly.datn.ecommerce_website.dto.TopCustomersDTO(b.customer.customerId, b.customer.users.fullName, b.customer.users.phoneNumber, SUM(b.billPriceAfterVoucher)) " +
            "FROM Bills b " +
            "WHERE ( b.billCreateDate BETWEEN :startDate AND :endDate )" +
            " AND b.billStatus = 1 " +
            "GROUP BY b.customer.customerId, b.customer.users.fullName, b.customer.users.phoneNumber " +
            "ORDER BY SUM(b.billPriceAfterVoucher) DESC")
    List<TopCustomersDTO> findTopCustomersByTotalPrice(
            Pageable pageable,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );






}

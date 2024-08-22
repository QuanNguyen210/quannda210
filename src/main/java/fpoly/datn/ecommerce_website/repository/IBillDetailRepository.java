package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.dto.TopProductsDTO;
import fpoly.datn.ecommerce_website.entity.BillDetails;
import fpoly.datn.ecommerce_website.entity.BillDetails_ChiTiet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface IBillDetailRepository extends JpaRepository<BillDetails, String> {
    @Query(" SELECT bd FROM  BillDetails_ChiTiet bd " +
            " where bd.bills.billId = :billID " +
            " AND ( :status IS NULL OR bd.billDetailStatus != :status ) " )
    List<BillDetails_ChiTiet> findAllByBillId(@Param("billID") String billID, Integer status);


    // get all billdetail lỗi
    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailError(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // khi chọn customer
    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( bd.bills.customer.customerId = :customerId ) "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorCustomer(
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    // khi chọn staff
    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND ( bd.bills.staff.staffId = :staffId ) "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorStaff(
            @Param("staffId") String staffId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);


    // get all billdetail online
    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate)" +
            " AND bd.bills.staff IS NULL "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorOnline(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate)" +
            " AND bd.bills.staff IS NULL " +
            " AND bd.bills.customer IS NULL "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorOnlineKhachHangLe(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            " WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            " AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND bd.bills.staff IS NULL " +
            " AND ( bd.bills.customer.customerId = :customerId ) "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorOnlineCustomer(
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);




    // get all billdetail offline
    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND bd.bills.staff IS NOT NULL "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorOffline(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) " +
//            " AND bd.bills.staff IS NOT NULL "
            " AND ( bd.bills.staff.staffId = :staffId ) "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorOfflineStaff(
            @Param("staffId") String staffId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) " +
            " AND bd.bills.staff IS NOT NULL " +
            " AND ( bd.bills.customer.customerId = :customerId ) "
    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorOfflineCustomer(
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT bd FROM BillDetails_ChiTiet bd " +
            "WHERE bd.bills.billCreateDate BETWEEN :startDate AND :endDate " +
            "AND ((:status = 0 AND bd.billDetailStatus = 0) " +
            "OR (:status = -2 AND bd.billDetailStatus = -2) " +
            "OR (:status = -3 AND bd.billDetailStatus = -3) " +
            "OR (  :status IS NULL AND bd.billDetailStatus IN (0, -2, -3) ) )" +
            " AND (:search IS NULL OR bd.bills.billCode LIKE %:search%  " +
            " OR bd.bills.orderPhone LIKE %:search% ) " +
            " AND (bd.bills.billCreateDate BETWEEN :startDate AND :endDate) " +
//            " AND bd.bills.staff IS NOT NULL "
            " AND (  bd.bills.staff.staffId = :staffId ) " +
            " AND (  bd.bills.customer.customerId = :customerId ) "

    )
    Page<BillDetails_ChiTiet> findAllBillDetailErrorOfflineStaffCustomer(
            @Param("staffId") String staffId,
            @Param("customerId") String customerId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") Integer status,
            @Param("search") String search,
            Pageable pageable);







    @Query(" SELECT bd FROM  BillDetails_ChiTiet bd " +
            " where bd.bills.billId = :billID " +
            " AND (  bd.billDetailStatus = 1 OR bd.billDetailStatus = 0 ) " )
    List<BillDetails_ChiTiet> findAllByBillIdUpdateAmount(@Param("billID") String billID);

    @Query("SELECT bd FROM  BillDetails_ChiTiet bd " +
            "where bd.billDetailId = :billDetailId " )
    BillDetails_ChiTiet findBillDetailsById(@Param("billDetailId") String billDetailId);

//    @Query("SELECT bd FROM  BillDetails bd join ProductDetails pd" +
//            "  on bd.productDetails.productDetailId = pd.productDetailId" +
//            " join Products p on pd.product.productId = p.productId where bd.bills.billId = :billID")
//    List<BillDetails> findAllBillDetailsById(@Param("billID") String billID);

//    @Query("SELECT NEW fpoly.datn.ecommerce_website.dto.TopProductsDTO( " +
//            " product.images, product.productCode, product.productName, productDetails.retailPrice, SUM(billDetail.amount)) " +
//            " FROM BillDetails_ChiTiet billDetail " +
//            " JOIN billDetail.productDetails productDetails " +
//            " JOIN productDetails.product product  " +
//            " WHERE billDetail.billDetailStatus >= 0 " + // Sử dụng <> thay vì !=
//            " GROUP BY product.productCode, product.productName " +
//            " ORDER BY SUM(billDetail.amount) DESC ")
//    List<TopProductsDTO> findTopProductsByTotalAmount(Pageable pageable);
}

package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.entity.ProductDetails;
import fpoly.datn.ecommerce_website.entity.Products;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface IProductDetailRepository extends JpaRepository<ProductDetails, String> {
    @Query("SELECT pd FROM  ProductDetails pd " +
            "join Products p on p.productId = pd.product.productId " +
            "where pd.product.productCode = :productCode")
    List<ProductDetails> findAllByProductCode(@Param("productCode") String productCode);
    @Query("SELECT pd FROM  ProductDetails pd " +
            "join Products p on p.productId = pd.product.productId " +
            "where pd.product.productId = :productId")
    List<ProductDetails> findAllByProductId(@Param("productId") String productId);

    @Query("SELECT b from ProductDetails b " +
            " where ( :productName IS NULL OR  upper(b.product.productName) like '%'+upper(:productName)+'%') " +
            " and  ( :productCode IS NULL OR upper(b.product.productCode) like '%'+upper(:productCode)+'%')  " +
            " and  ( :colorName IS NULL OR upper(b.color.colorName) like '%'+upper(:colorName)+'%' )" +
            " and  ( :typeName IS NULL OR upper(b.type.typeName) like '%'+upper(:typeName)+'%' ) " +
            " and  ( :materialName IS NULL OR upper(b.material.materialName) like '%'+upper(:materialName)+'%' ) " +
            " and  ( :sizeName IS NULL OR upper(b.size.sizeName) like '%'+upper(:sizeName)+'%' ) " +
            " and  ( :brandName IS NULL OR upper(b.product.brand.brandName) like '%'+upper(:brandName)+'%' ) " +
            " and  ( :compartmentName IS NULL OR upper(b.compartment.compartmentName)  like '%'+upper(:compartmentName)+'%' ) " +
            " and  ( :producerName IS NULL OR upper(b.producer.producerName) like '%'+upper(:producerName)+'%' ) "  +
            " and  ( :producerName IS NULL OR upper(b.producer.producerName) like '%'+upper(:producerName)+'%' ) "  +
            " and  ( :buckleTypeName IS NULL OR upper(b.buckleType.buckleTypeName) like '%'+upper(:buckleTypeName)+'%' ) "  +
            " and  ( :productDetailDescribe IS NULL OR upper(b.productDetailDescribe) like '%'+upper(:productDetailDescribe)+'%' )  " +
            "and (:minProductDetailAmount IS NULL OR b.productDetailAmount >= :minProductDetailAmount) " +
            "and (:maxProductDetailAmount IS NULL OR b.productDetailAmount <= :maxProductDetailAmount) " +
            "and (:minImportPrice IS NULL OR b.importPrice >= :minImportPrice) " +
            "and (:maxImportPrice IS NULL OR b.importPrice <= :maxImportPrice) " +
            "and (:minRetailPrice IS NULL OR b.retailPrice >= :minRetailPrice) " +
            "and (:maxRetailPrice IS NULL OR b.retailPrice <= :maxRetailPrice) " +
            " and (:productDetailStatus IS NULL OR b.productDetailStatus = :productDetailStatus) ")
    public Page<ProductDetails> getProductDetailsWithoutDelete(
            @Param("productName") String productName,
            @Param("productCode") String productCode,
            @Param("colorName") String colorName,
            @Param("typeName") String typeName,
            @Param("materialName") String materialName,
            @Param("sizeName") String sizeName,
            @Param("brandName") String brandName,
            @Param("compartmentName") String compartmentName,
            @Param("producerName") String producerName,
            @Param("buckleTypeName") String buckleTypeName,
            @Param("productDetailDescribe") String productDetailDescribe,
            @Param("minProductDetailAmount") Integer minProductDetailAmount,
            @Param("maxProductDetailAmount") Integer maxProductDetailAmount,
            @Param("minImportPrice") Integer minImportPrice,
            @Param("maxImportPrice") Integer maxImportPrice,
            @Param("minRetailPrice") Integer minRetailPrice,
            @Param("maxRetailPrice") Integer maxRetailPrice,
            @Param("productDetailStatus") Integer productDetailStatus,
            Pageable pageable);

    //@Query("SELECT b from ProductDetails b " +
//        " where b.product.productName  LIKE  '%'upper(:productName)'%'")
//    public Page<ProductDetails> getProductDetailsWithoutDelete(
//            @Param("productName") String productName,
//            Pageable pageable);
    @Query("SELECT bd FROM Products b JOIN ProductDetails bd ON b.productId = bd.product.productId  " +
            "WHERE  bd.productDetailStatus = 1 " +
            "AND bd.productDetailAmount > 0 " +
            "and ( b.productCode LIKE %:keyword% " +
            "OR b.productId LIKE %:keyword% " +
            "OR b.productName LIKE %:keyword% " +
            "OR bd.color.colorName LIKE %:keyword% " +
            "OR bd.type.typeName LIKE %:keyword% " +
            "OR bd.material.materialName LIKE %:keyword% " +
            "OR bd.size.sizeName LIKE %:keyword% " +
            "OR b.brand.brandName LIKE %:keyword% " +
            "OR bd.compartment.compartmentName LIKE %:keyword% " +
            "OR bd.buckleType.buckleTypeName LIKE %:keyword% " +
            "OR bd.producer.producerName LIKE %:keyword% " +
            "OR bd.productDetailDescribe LIKE %:keyword% ) "

//            "OR bd.importPrice = cast(:keyword as int ) " +
//            "or (:keyword = '' or (CAST(:keyword AS int) IS NULL AND bd.retailPrice =CAST(:keyword AS int))) "
    )
    List<ProductDetails> findByKeyword(@Param("keyword") String keyword);

    @Query("SELECT bd.productDetails.product, SUM(bd.amount) as totalSold " +
            "FROM BillDetails bd " +
            "WHERE ( bd.bills.billCreateDate BETWEEN :startDate AND :endDate ) " +
            " AND bd.bills.billStatus <> -1 AND bd.billDetailStatus >= 0 " +
            "GROUP BY bd.productDetails.product " +
            "ORDER BY totalSold DESC")
    List<Object[]> findTop5Products(@Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageable);

    @Query("SELECT bd.productDetails.product, SUM(bd.amount) as totalSold " +
            "FROM BillDetails bd " +
            "WHERE ( bd.bills.billCreateDate BETWEEN :startDate AND :endDate ) " +
            " AND  bd.billDetailStatus <= -2  " + // -1 là đã hủy, -2 là hàng lỗi
            "GROUP BY bd.productDetails.product " +
            "ORDER BY totalSold DESC")
    List<Object[]> findProductFail(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

}

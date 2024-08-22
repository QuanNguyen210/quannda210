package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.dto.ProductDetailDTO;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IProductDetalisService {
    List<ProductDetailDTO> findAll();

    Page<ProductDetailDTO> findAllPagination(
            int pageNum,
            int pageSize,
            String productName,
            String productCode,
            String colorName,
            String typeName,
            String materialName,
            String sizeName,
            String brandName,
            String compartmentName,
            String producerName,
            String buckleTypeName,
            String productDetailDescribe,
            Integer  minProductDetailAmount,
            Integer  maxProductDetailAmount,
            Integer  minImportPrice,
            Integer  maxImportPrice,
            Integer  minRetailPrice,
            Integer  maxRetailPrice,
            Integer  productDetailStatus,
            List<String> sortList,
            String sortOrder
    );

    List<ProductDetails> findAllByProductCode(String baloID);

    ProductDetailDTO updateStatus(String productDetailsID, int status);

    ProductDetails findById(String id);

    ProductDetailDTO save(ProductDetailDTO entity);

    ProductDetails update(ProductDetails entity);

    String delete(String id);

    List<ProductDetails> searchByName(String name);

    List<ProductDetails> findByKeyword(String keyword);
}

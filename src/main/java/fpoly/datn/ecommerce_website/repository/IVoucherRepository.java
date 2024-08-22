package fpoly.datn.ecommerce_website.repository;

import fpoly.datn.ecommerce_website.entity.Vouchers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IVoucherRepository extends JpaRepository<Vouchers,String> {

    @Query("select v from Vouchers v where v.voucherCode = :voucherCode")
    public Vouchers findByVoucherCode(String voucherCode);

}

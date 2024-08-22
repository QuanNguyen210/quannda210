import React, { useEffect, useState } from 'react';

function ShipAPI() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const token = '96b259e7-9ca7-11ee-b394-8ac29577e80e';
  const shopId = '4773374';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
          headers: {
            token: `${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProvinces(data.data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProvinceChange = async (e) => {
    const selectedProvinceId = e.target.value;
    setSelectedProvince(selectedProvinceId);
    setDistricts([]);
    setWards([]);
    setShippingFee(0);

    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvinceId}`,
        {
          headers: {
            token: `${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setDistricts(data.data);
      } else {
        console.error('Failed to fetch districts');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleDistrictChange = async (e) => {
    const selectedDistrictId = e.target.value;
    setSelectedDistrict(selectedDistrictId);

    try {
      const response = await fetch(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrictId}`,
        {
          headers: {
            token: `${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setWards(data.data);
      } else {
        console.error('Failed to fetch wards');
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleWardChange = async (e) => {
    const selectedWardCode = e.target.value;
    setSelectedWard(selectedWardCode);

    try {
      if (selectedDistrict && selectedWardCode) {
        const response = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee?service_id=53321&insurance_value=1000000&coupon&to_district_id=${selectedDistrict}&from_district_id=1482&weight=500&from_ward_code=11008&to_ward_code=${selectedWardCode}&length=30&width=15&height=40`,
          {
            headers: {
              token: `${token}`,
              'Content-Type': 'application/json; charset=utf-8',
              shop_id: `${shopId}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setShippingFee(data.data.total);
        } else {
          console.error('Failed to fetch shipping fee');
        }
      }
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
    }
  };

  return (
    <div>
      <select onChange={handleProvinceChange}>
        <option value="">Chọn tỉnh/thành phố</option>
        {provinces.map((province) => (
          <option key={province.ProvinceID} value={province.ProvinceID}>
            {province.ProvinceName}
          </option>
        ))}
      </select>

      <select onChange={handleDistrictChange} disabled={!selectedProvince}>
        <option value="">Chọn quận/huyện</option>
        {districts.map((district) => (
          <option key={district.DistrictID} value={district.DistrictID}>
            {district.DistrictName}
          </option>
        ))}
      </select>

      <select onChange={handleWardChange} disabled={!selectedDistrict}>
        <option value="">Chọn phường/xã</option>
        {wards.map((ward) => (
          <option key={ward.WardCode} value={ward.WardCode}>
            {ward.WardName}
          </option>
        ))}
      </select>

      <div>Phí vận chuyển: {shippingFee}</div>
    </div>
  );
}

export default ShipAPI;

// const productDetail = await productDetailsAPI.get(item.productDetails.productDetailId);

// if (productDetail) {
//   // Bước 2: Kiểm tra số lượng trong billDetail và số lượng sản phẩm trong cơ sở dữ liệu
//   if (item.amount <= productDetail.quantityAvailable) {
//     // Nếu số lượng trong billDetail nhỏ hơn hoặc bằng số lượng sản phẩm trong cơ sở dữ liệu
//     // Tiến hành thêm hóa đơn và chi tiết hóa đơn
//     const responseBill = await billsAPI.add(billData);
//     const billId = responseBill.data.billId;

//     // Thêm chi tiết hóa đơn
//     const responseBillDetails = await billDetailAPI.add({
//       bills: {
//         billId: billId,
//       },
//       productDetails: {
//         productDetailId: item.productDetails.productDetailId,
//       },
//       amount: item.amount,
//       // ... (các thông tin khác của chi tiết hóa đơn)
//     });

//     // Cập nhật số lượng sản phẩm trong cơ sở dữ liệu (trừ đi số lượng đã bán)
//     await updateProductDetailAmount(item.productDetails.productDetailId, item.amount);

//     // Xử lý tiếp theo (xóa giỏ hàng, thông báo thành công, v.v.)
//   } else {
//     // Nếu số lượng trong billDetail lớn hơn số lượng sản phẩm trong cơ sở dữ liệu
//     // Thực hiện xử lý lỗi hoặc thông báo cho người dùng
//     console.log('Số lượng sản phẩm không đủ');
//     // Xử lý thông báo lỗi hoặc hiển thị thông báo cho người dùng
//   }
// } else {
//   console.log('Không tìm thấy thông tin sản phẩm chi tiết');
//   // Xử lý thông báo lỗi hoặc hiển thị thông báo cho người dùng
// }


// const handleConfirmation1 = async () => {
//   // ... (các phần code khác)
//   try {
//     // ... (các phần code khác)

//     // Lấy thông tin sản phẩm chi tiết từ cơ sở dữ liệu
//     const fetchProductDetail = async (productDetailId) => {
//       try {
//         const response = await productDetailsAPI.get(productDetailId);
//         const data = response.data;
//         return data?.productDetails[0]?.productDetailAmount || 0;
//       } catch (error) {
//         console.error('Error fetching product details:', error);
//         return 0;
//       }
//     };

//     const billDetailsData = await Promise.all(
//       cartDetailss.map(async (item) => {
//         const productDetailAmount = await fetchProductDetail(item.productDetails.productDetailAmount);

//         if (item.amount <= productDetailAmount) {
//           return {
//             bills: {
//               billId: billId,
//             },
//             productDetails: {
//               productDetailId: item.productDetails.productDetailId,
//             },
//             amount: item.amount,
//             billDetailStatus: 1,
//             billDetailNote: null,
//             price: item.productDetails.retailPrice,
//           };
//         } else {
//           console.log('Số lượng sản phẩm không đủ');
//           // Xử lý thông báo lỗi hoặc hiển thị thông báo cho người dùng (nếu cần)
//           return null;
//         }
//       })
//     );

//     // Loại bỏ các billDetail không hợp lệ (số lượng sản phẩm không đủ)
//     const validBillDetailsData = billDetailsData.filter((billDetail) => billDetail !== null);

//     // Thêm các billDetail hợp lệ vào cơ sở dữ liệu
//     const responseBillDetails = await Promise.all(
//       validBillDetailsData.map((billDetail) => billDetailAPI.add(billDetail))
//     );

//     // ... (các phần code khác)
//   } catch (error) {
//     // ... (xử lý lỗi)
//   }
// };

// await Promise.all(
//   cartDetailss.map(async (item) => {
//     const productDetail = await productDetailsAPI.get(item.productDetails.productDetailId);
//     await updateProductDetailAmount(item.productDetails.productDetailId, item.amount);
//   }),
// );

// const handleConfirmation1 = async () => {
//   try {
//     // ... (các phần code khác)

//     const responseBillDetails = await Promise.all(
//       validBillDetailsData.map((billDetail) => billDetailAPI.add(billDetail))
//     );

//     // Cập nhật số lượng sản phẩm sau khi đã thêm thành công billDetail
//     await Promise.all(
//       validBillDetailsData.map(async (billDetail, index) => {
//         if (billDetail) {
//           // Nếu billDetail là hợp lệ
//           await updateProductDetailAmount(
//             billDetail.productDetails.productDetailId,
//             billDetail.amount
//           );
//         }
//       })
//     );

//     // ... (các phần code khác)
//   } catch (error) {
//     // ... (xử lý lỗi)
//   }
// };

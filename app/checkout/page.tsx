"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import {
  viewCart,
  viewShippingAddresses,
  addShippingAddress,
  updateShippingAddress,
  setDefaultShippingAddress,
  createCheckout,
} from "../../redux/slices/bookSlice";

import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // REDUX
  // ==========================================

  const {
    cart,
    shippingAddresses,
    checkoutLoading,
    shippingAddressLoading,
  } = useSelector((state: RootState) => state.books);

  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [selectedAddressId, setSelectedAddressId] =
    useState<string>("");

  const [isEditingAddress, setIsEditingAddress] =
    useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ==========================================
  // FETCH CART + ADDRESSES
  // ==========================================

  useEffect(() => {
    dispatch(viewCart());
    dispatch(viewShippingAddresses());
  }, [dispatch]);

  // ==========================================
  // SELECT DEFAULT ADDRESS
  // ==========================================

  useEffect(() => {
    if (shippingAddresses.length === 0) {
      setSelectedAddressId("");
      return;
    }

    const defaultAddress = shippingAddresses.find(
      (item) => item.isDefault
    );

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress._id);
    } else if (!selectedAddressId) {
      setSelectedAddressId(
        shippingAddresses[0]._id
      );
    }
  }, [shippingAddresses, selectedAddressId]);

  // ==========================================
  // SELECTED ADDRESS
  // ==========================================

  const selectedAddress = shippingAddresses.find(
    (item) => item._id === selectedAddressId
  );

  // ==========================================
  // ADDRESS CHANGE
  // ==========================================

  const handleAddressChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ADD ADDRESS
  // ==========================================

  const handleAddAddress = () => {
    setEditingAddressId(null);

    setAddress({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    setIsEditingAddress(true);
  };

  // ==========================================
  // OPEN EDIT ADDRESS
  // ==========================================

  const handleEditAddress = (
    addressData: typeof address & {
      _id: string;
    }
  ) => {
    setEditingAddressId(addressData._id);

    setAddress({
      firstName: addressData.firstName,
      lastName: addressData.lastName,
      phone: addressData.phone,
      address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
    });

    setIsEditingAddress(true);
  };

  // ==========================================
  // SAVE ADDRESS
  // ==========================================

  const handleSaveAddress = async () => {
    if (
      !address.firstName.trim() ||
      !address.lastName.trim() ||
      !address.phone.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      toast.error(
        "Please fill all shipping address fields"
      );
      return;
    }

    try {
      if (editingAddressId) {
        await dispatch(
  updateShippingAddress({
    addressId: editingAddressId,
    data: address,
  })
).unwrap();

        toast.success(
          "Address updated successfully"
        );
      } else {
        const result = await dispatch(
          addShippingAddress(address)
        ).unwrap();

        toast.success(
          "Address added successfully"
        );

        // If backend returns newly created address
        if (result?.data?._id) {
          setSelectedAddressId(
            result.data._id
          );
        }
      }

      await dispatch(
        viewShippingAddresses()
      ).unwrap();

      setIsEditingAddress(false);
      setEditingAddressId(null);
    } catch (error: any) {
      toast.error(
        error ||
          "Failed to save shipping address"
      );
    }
  };

  // ==========================================
  // SET DEFAULT ADDRESS
  // ==========================================

  const handleSetDefault = async (
    addressId: string
  ) => {
    try {
      await dispatch(
        setDefaultShippingAddress(addressId)
      ).unwrap();

      setSelectedAddressId(addressId);

      await dispatch(
        viewShippingAddresses()
      ).unwrap();

      toast.success(
        "Default address updated"
      );
    } catch (error: any) {
      toast.error(
        error ||
          "Failed to set default address"
      );
    }
  };

  // ==========================================
  // CANCEL ADDRESS FORM
  // ==========================================

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    setEditingAddressId(null);
  };

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) => {
      const price = Number(
        item.bookId?.discountPrice ??
          item.bookId?.price ??
          0
      );

      const quantity = Number(
        item.quantity ?? 0
      );

      return total + price * quantity;
    },
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;

  const totalAmount =
    subtotal + shipping;

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddressId) {
      toast.error(
        "Please select a shipping address"
      );
      return;
    }

    try {
      await dispatch(
        createCheckout({
          shippingAddressId:
            selectedAddressId,
          paymentMethod,
        })
      ).unwrap();

      setTimeout(() => {
        router.push("/orderHistory");
      }, 1000);
    } catch (error: any) {
      toast.error(
        error ||
          "Failed to place order"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (
    shippingAddressLoading &&
    shippingAddresses.length === 0
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-500">
          Loading checkout...
        </p>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <>
        <div className="mx-auto mt-16 max-w-xl rounded-lg bg-white p-8 text-center shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Your cart is empty
          </h2>

          <p className="mb-6 text-gray-500">
            Add some books to your cart before
            proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/books")
            }
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>

        <ToastContainer position="top-right" />
      </>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Checkout
            </h1>

            <p className="mt-2 text-gray-500">
              Complete your order by providing
              your delivery details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* ==================================
                LEFT SIDE
            ================================== */}

            <div className="space-y-6 lg:col-span-2">

              {/* ==================================
                  SHIPPING ADDRESS
              ================================== */}

              <section className="rounded-lg bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Delivery Address
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Where should we deliver your
                      order?
                    </p>
                  </div>

                  {!isEditingAddress && (
                    <button
                      type="button"
                      onClick={
                        handleAddAddress
                      }
                      className="font-medium text-blue-600 hover:underline"
                    >
                      + Add New Address
                    </button>
                  )}

                </div>

                {/* =================================
                    ADDRESS FORM
                ================================= */}

                {isEditingAddress ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">

                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {editingAddressId
                          ? "Edit Address"
                          : "Add New Address"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Enter your complete delivery
                        address.
                      </p>
                    </div>

                    {/* FIRST + LAST NAME */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          First Name
                        </label>

                        <input
                          type="text"
                          name="firstName"
                          value={
                            address.firstName
                          }
                          onChange={
                            handleAddressChange
                          }
                          placeholder="Enter first name"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Last Name
                        </label>

                        <input
                          type="text"
                          name="lastName"
                          value={
                            address.lastName
                          }
                          onChange={
                            handleAddressChange
                          }
                          placeholder="Enter last name"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                    </div>

                    {/* PHONE */}

                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          address.phone
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Enter phone number"
                        maxLength={10}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* ADDRESS */}

                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address
                      </label>

                      <textarea
                        name="address"
                        value={
                          address.address
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="House number, street, area"
                        rows={3}
                        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* CITY + STATE */}

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          City
                        </label>

                        <input
                          type="text"
                          name="city"
                          value={
                            address.city
                          }
                          onChange={
                            handleAddressChange
                          }
                          placeholder="Enter city"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          State
                        </label>

                        <input
                          type="text"
                          name="state"
                          value={
                            address.state
                          }
                          onChange={
                            handleAddressChange
                          }
                          placeholder="Enter state"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                    </div>

                    {/* PINCODE */}

                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Pincode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={
                          address.pincode
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Enter pincode"
                        maxLength={6}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* FORM BUTTONS */}

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        onClick={
                          handleCancelAddress
                        }
                        className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSaveAddress
                        }
                        disabled={
                          shippingAddressLoading
                        }
                        className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {shippingAddressLoading
                          ? "Saving..."
                          : "Save Address"}
                      </button>

                    </div>

                  </div>
                ) : (
                  <>
                    {/* =================================
                        SAVED ADDRESSES
                    ================================= */}

                    {shippingAddresses.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">

                        <p className="mb-4 text-gray-500">
                          No delivery address added.
                        </p>

                        <button
                          type="button"
                          onClick={
                            handleAddAddress
                          }
                          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Add Address
                        </button>

                      </div>
                    ) : (
                      <div className="space-y-3">

                        {shippingAddresses.map(
                          (addr) => (
                            <div
                              key={addr._id}
                              onClick={() =>
                                setSelectedAddressId(
                                  addr._id
                                )
                              }
                              className={`cursor-pointer rounded-lg border p-4 transition ${
                                selectedAddressId ===
                                addr._id
                                  ? "border-blue-500 bg-blue-50/40"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >

                              <div className="flex flex-col justify-between gap-4 sm:flex-row">

                                <div className="flex gap-3">

                                  {/* RADIO */}

                                  <div className="pt-1">
                                    <input
                                      type="radio"
                                      checked={
                                        selectedAddressId ===
                                        addr._id
                                      }
                                      onChange={() =>
                                        setSelectedAddressId(
                                          addr._id
                                        )
                                      }
                                      onClick={(e) =>
                                        e.stopPropagation()
                                      }
                                      className="h-4 w-4 accent-blue-600"
                                    />
                                  </div>

                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">

                                      <h3 className="font-semibold text-gray-800">
                                        {addr.firstName}{" "}
                                        {addr.lastName}
                                      </h3>

                                      {addr.isDefault && (
                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                          Default
                                        </span>
                                      )}

                                    </div>

                                    <p className="mt-1 text-sm text-gray-600">
                                      {addr.address}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                      {addr.city},{" "}
                                      {addr.state} -{" "}
                                      {addr.pincode}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                      Phone:{" "}
                                      {addr.phone}
                                    </p>
                                  </div>

                                </div>

                                {/* ACTIONS */}

                                <div className="flex items-start gap-3 text-sm">

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      handleEditAddress(
                                        addr
                                      );
                                    }}
                                    className="font-medium text-blue-600 hover:underline"
                                  >
                                    Edit
                                  </button>

                                  {!addr.isDefault && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        handleSetDefault(
                                          addr._id
                                        );
                                      }}
                                      className="font-medium text-gray-500 hover:text-gray-700 hover:underline"
                                    >
                                      Set Default
                                    </button>
                                  )}

                                </div>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}
                  </>
                )}

              </section>

              {/* ==================================
                  PAYMENT
              ================================== */}

              <section className="rounded-lg bg-white p-6 shadow-sm">

                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Select how you want to pay.
                  </p>
                </div>

                <div className="space-y-3">

                  {/* COD */}

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      paymentMethod === "COD"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={
                        paymentMethod === "COD"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      className="h-4 w-4 accent-blue-600"
                    />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay when your order arrives.
                      </p>
                    </div>

                  </label>

                  {/* ONLINE */}

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      paymentMethod === "ONLINE"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={
                        paymentMethod === "ONLINE"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      className="h-4 w-4 accent-blue-600"
                    />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Online Payment
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay securely online.
                      </p>
                    </div>

                  </label>

                </div>

              </section>

            </div>

            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <aside className="h-fit rounded-lg bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-xl font-semibold text-gray-800">
                Order Summary
              </h2>

              {/* PRODUCTS */}

              <div className="mb-5 max-h-80 space-y-4 overflow-y-auto">

                {cart.map((item) => {
                  const book = item.bookId;

                  if (!book) {
                    return null;
                  }

                  const price = Number(
                    book.discountPrice ??
                      book.price ??
                      0
                  );

                  const quantity = Number(
                    item.quantity ?? 0
                  );

                  const itemTotal =
                    price * quantity;

                  const image =
                    book.images?.[0] ||
                    "/placeholder-book.png";

                  return (
                    <div
                      key={item._id}
                      className="flex gap-3 border-b border-gray-100 pb-4"
                    >

                      <img
                        src={
                          image.startsWith("http")
                            ? image
                            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${image.startsWith("/") ? "" : "/"}${image}`
                        }
                        alt={book.title}
                        className="h-20 w-14 rounded object-cover"
                      />

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate font-medium text-gray-800">
                          {book.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-blue-600">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* PRICE */}

              <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </span>
                </div>

              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="mb-6 flex justify-between text-lg font-bold text-gray-900">

                <span>Total</span>

                <span>
                  ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  checkoutLoading ||
                  !selectedAddressId
                }
                className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {checkoutLoading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/books")
                }
                className="mt-3 w-full rounded-md border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </button>

            </aside>

          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </>
  );
}
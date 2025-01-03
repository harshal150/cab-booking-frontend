import React from "react";
import PropTypes from "prop-types";

const paymentData = [
	{
		img: "https://cdn.easyfrontend.com/pictures/logos/master-card-logo.png",
	},
	{
		img: "https://cdn.easyfrontend.com/pictures/logos/discover-logo.png",
	},
	{
		img: "https://cdn.easyfrontend.com/pictures/logos/visa-logo.png",
	},
	{
		img: "https://cdn.easyfrontend.com/pictures/logos/paypal-logo.png",
	},
	{
		img: "https://cdn.easyfrontend.com/pictures/logos/ebay-logo.png",
	},
	{
		img: "https://cdn.easyfrontend.com/pictures/logos/western-union-logo.png",
	},
];

const PaymentOptions = ({ item }) => {
	return (
		<button className="bg-[#F1F5F8]  min-h-[120px] border-none opacity-80 transition duration-400 hover:opacity-100 flex justify-center items-center py-[24px] px-[48px] rounded-md h-full w-full">
			<img src={item.img} alt="" className="max-w-full h-auto" />
		</button>
	);
};
PaymentOptions.propTypes = {
	item: PropTypes.object.isRequired,
};

const CardDetails = () => {
	return (
		<>
			{/* card number  */}
			<div className="col-span-12 md:col-span-6 lg:col-span-4">
				<label className="font-medium mb-0" htmlFor="email">
					Card Number
				</label>
				<div className="mt-4 md:mt-3 mb-4">
					<input
						type="number"
						className="min-h-[48px] w-full leading-[36px] bg-transparent border boder-[#BBBFC8]  pl-[24px] focus:outline focus:outline-blue-500 focus:border-none rounded-md opacity-75"
						id="email"
						placeholder="Enter your card number"
					/>
				</div>
			</div>
			{/* name  */}
			<div className="col-span-12 md:col-span-6 lg:col-span-4">
				<label className="font-medium mb-0" htmlFor="number">
					Name on the card
				</label>
				<div className="mt-4 md:mt-3 mb-4">
					<input
						type="text"
						className="min-h-[48px] w-full leading-[36px] bg-transparent border boder-[#BBBFC8]  pl-[24px] focus:outline focus:outline-blue-500 focus:border-none rounded-md opacity-75"
						id="number"
						placeholder="Enter your Name"
					/>
				</div>
			</div>

			<div className="col-span-12 md:col-span-6 lg:col-span-4">
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-8">
						<label htmlFor="email" className="font-medium mb-0">
							Expiry Date
						</label>
						<div className="mt-4 md:mt-3 mb-4 flex gap-4">
							<select
								type="month"
								className="min-h-[48px] w-full leading-[36px] bg-transparent border boder-[#BBBFC8]  pl-2 focus:outline focus:outline-blue-500 focus:border-none rounded-md opacity-60"
							>
								<option value="">MM</option>
							</select>
							<select
								type="year"
								className="min-h-[48px] w-full leading-[36px] bg-transparent border boder-[#BBBFC8]  pl-2 focus:outline focus:outline-blue-500 focus:border-none rounded-md opacity-60"
							>
								<option value="">YY</option>
							</select>
						</div>
					</div>
					<div className="col-span-4">
						<label htmlFor="email" className="font-medium mb-0">
							CVV Code
						</label>
						<div className="mt-4 md:mt-3 mb-4">
							<input
								type="number"
								className="min-h-[48px] w-full leading-[36px] bg-transparent border boder-[#BBBFC8]  pl-[24px] focus:outline focus:outline-blue-500 focus:border-none rounded-md opacity-75"
								id="cvv"
								placeholder="0000"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};



const PaymentForm = () => {
	return (
		<form>
			<div className="shadow-2xl mt-10 p-4 md:p-[50px] border-none rounded-md">
				<p className="font-medium mb-0">Credit Card Type</p>
				<div className="grid grid-cols-12 gap-4 md:gap-8 mb-5">
					{paymentData.map((item, i) => (
						<div
							className="col-span-6 sm:col-span-4 lg:col-span-2 mt-4 lg:mt-2"
							key={i}
						>
							<PaymentOptions item={item} />
						</div>
					))}
				</div>
				<div className="grid grid-cols-12 gap-4 pt-8">
					<CardDetails />
				</div>

				<hr className="border-white opacity-10 mt-10 pb-12" />

				
			</div>
			<div className="grid grid-cols-12 gap-4 mt-4">
				<div className="col-span-12">
					<div>
						<button
							type="submit"
							className="px-6 py-2 bg-[#0E6EFD] border border-[#0E6EFD] text-white h-[45px] text-lg leading-none rounded-md hover:opacity-90"
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};

const Checkout = () => {
	return (
		<section className="ezy__travel6 light bg-white  text-gray-700  py-10 md:p-[100px] overflow-hidden">
			<div className="container px-4 mx-auto">
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-12">
						<div className="bg-[#404156] p-[24px] rounded-md text-center">
							<h2 className="font-bold text-2xl md:text-[32px] leading-none text-white mb-0">
								How you would like to pay?
							</h2>
						</div>
					</div>
				</div>

				<PaymentForm />
			</div>
		</section>
	);
};

export default Checkout
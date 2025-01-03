import React, { useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { Select } from '@radix-ui/react-select';
import { Slot } from '@radix-ui/react-slot';

// Data For Device Rates and Credit Terms
const EQUIPMENT_PRICES = {
    "Clover 2D Barcode Scanner (hand held)": 169.00,
    "Clover 2D Barcode Scanner (hands free)": 235.00,
    "Clover Cash Drawer": 79.00,
    "Clover Compact": 299.00,
    "Clover Compact Tethering Cable": 12.00,
    "Clover Deployment Fee": 10.00,
    "Clover Duo LTE Gen2": 2008.00,
    "Clover Flex 3rd Gen Bundle": 679.00,
    "Clover Flex LTE Gen3-Refurbished": 579.00,
    "Clover Flex Silicone Sleeve": 25.00,
    "Clover KDS - Kitchen Display 24": 789.00,
    "Clover KDS Countertop Base": 95.00,
    "Clover KDS Wall Mount": 94.00,
    "Clover Kids": 2357.60,
    "Clover Mini LTE 3rd Gen Bundle": 879.00,
    "Clover Mini Swivel": 74.00,
    "Clover Pedestal": 475.80,
    "Clover Solo LTE/WiFi Bundle Tablet,Printer,Drawer": 1617.00,
    "Epson Sticky Label Printer": 522.00,
    "Kitchen Printer": 415.75,
    "Kitchen Printer – Asian Characters": 456.00,
    "Star Micro Thermal Kitchen Printer": 286.00,
    "Weight Scale": 435.75
  };

const CREDIT_TIERS_48 = {
    'P': 0.0361,
    '1': 0.0395,
    '2': 0.05,
    '3': 0.055
};

const CREDIT_TIERS_36 = {
    'P': 0.0518,
    '1': 0.053,
    '2': 0.065,
    '3': 0.0696
};

const Calculator = () => {
    const [items, setItems] = useState([{
        equipment: '',
        quantity: 1,
        term: '48',
        creditTier: 'P',
        monthlyPayment: '',
        id: 1
    }]);

    const calculateCommission = (item) => {
        const equipmentPrice = EQUIPMENT_PRICES[item.equipment] || 0;
        const quantity = parseInt(item.quantity) || 0;
        const totalEquipmentCost = equipmentPrice * quantity;
        
        const creditTiers = item.term === '48' ? CREDIT_TIERS_48 : CREDIT_TIERS_36;
        const factor = creditTiers[item.creditTier];
        
        const monthlyPayment = parseFloat(item.monthlyPayment);
        if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
            return {
                error: "Please Enter Valid Payment!",
                commission: 'Err: NaN',
                totalPayment: 'Err: NaN',
                monthlyPayment: 'Err: NaN'
            };
        }
        
        const totalFinancedAmount = (monthlyPayment / factor);
        const commission = totalFinancedAmount - totalEquipmentCost;
        
        return {
            monthlyPayment: monthlyPayment.toFixed(2),
            totalPayment: totalFinancedAmount.toFixed(2),
            commission: commission.toFixed(2)
        };
    };

    const addItem = () => {
        setItems([...items, {
            equipment: '',
            quantity: 1,
            term: '48',
            creditTier: 'P',
            monthlyPayment: '',
            id: Date.now()
        }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalCommission = items
        .map(item => parseFloat(calculateCommission(item)?.commission || 0))
        .reduce((sum, commission) => sum + commission, 0)
        .toFixed(2);

    return (
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Star Accept Equipment Commission Calculator
        </h1>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-lg">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">Monthly Payment ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.monthlyPayment}
                    onChange={(e) => updateItem(index, 'monthlyPayment', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Equipment</label>
                  <select
                    value={item.equipment}
                    onChange={(e) => updateItem(index, 'equipment', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select equipment</option>
                    {Object.entries(EQUIPMENT_PRICES).map(([equipment, price]) => (
                      <option key={equipment} value={equipment}>
                        {equipment} (${price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Quantity</label>
                  {/* Changed input to controlled input with value and onChange*/}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value, 10))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Term (months)</label>
                  <select
                    value={item.term}
                    onChange={(e) => updateItem(index, 'term', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="48">48 Months</option>
                    <option value="36">36 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Credit Tier</label>
                  <select
                    value={item.creditTier}
                    onChange={(e) => updateItem(index, 'creditTier', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="P">Tier P</option>
                    <option value="1">Tier 1</option>
                    <option value="2">Tier 2</option>
                    <option value="3">Tier 3</option>
                  </select>
                </div>

                {item.equipment && !isNaN(parseFloat(item.monthlyPayment)) && (
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <div className="font-medium">Monthly Payment</div>
                        <div>
                          ${calculateCommission(item).monthlyPayment || 'Err'}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-medium">Total Payment</div>
                        <div>
                          ${calculateCommission(item).totalPayment || 'Err'}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-medium">Commission</div>
                        <div>
                          ${calculateCommission(item).commission || 'Err'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="px-4 py-2 text-white bg-red-500 rounded md:col-span-2 hover:bg-red-600"
                  onClick={() => removeItem(index)}
                >
                  Remove Item
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={addItem}
            >
              Add Equipment
            </button>
            <div className="text-xl font-bold">
              Total Commission: ${totalCommission}
            </div>
          </div>
        </div>
      </div>
    );
};

export default Calculator;
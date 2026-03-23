# 📦 Category Quick Reference

## Valid Categories & Icons

| # | Category | Icon | Use For |
|---|----------|------|---------|
| 1 | Vegetables | 🥬 | Tomatoes, Carrots, Onions, Okra, Peppers, Leafy Greens |
| 2 | Fruits | 🍎 | Bananas, Pineapples, Mangoes, Watermelon, Avocado |
| 3 | Grains | 🌾 | Rice, Corn, Beans, Millet, Wheat, Cereals |
| 4 | Poultry | 🐔 | Chicken, Eggs, Duck, Turkey, Guinea Fowl |
| 5 | Meat | 🥩 | Beef, Pork, Goat, Fish, Snail, Rabbit |
| 6 | Dairy | 🥛 | Milk, Cheese, Yogurt, Butter |
| 7 | Spices | 🌶️ | Pepper, Ginger, Garlic, Shito, Prekese |

## Valid Units

| Unit | Use For | Example |
|------|---------|---------|
| kg | Weight-based products | Tomatoes, Rice, Meat |
| piece | Individual items | Pineapple, Watermelon, Cabbage |
| bunch | Bundled items | Bananas, Spring Onions, Carrots |
| crate | Crated items | Eggs, Bottles, Packaged goods |
| bag | Bagged items | Rice, Flour, Beans |
| liter | Liquid volume | Milk, Honey, Palm Oil |

## How It Works

### 1. Farmer Adds Product
```
Step 1: Click "Add New Product"
Step 2: Fill in details
Step 3: Select Category from dropdown
        ↓
    🥬 Vegetables
    🍎 Fruits
    🌾 Grains
    🐔 Poultry
    🥩 Meat
    🥛 Dairy
    🌶️ Spices
Step 4: Upload image (optional)
Step 5: Submit
```

### 2. Validation Happens
```
Frontend ✓ → Backend ✓ → Database ✓
```

### 3. Product Appears
```
Farmer Dashboard: Shows with icon "🥬 Vegetables"
Admin Dashboard: Shows for approval
Shop Page: Appears in correct category
```

## Category Selection Tips

### Choose the RIGHT Category:

✅ **Vegetables** - If it grows in the ground and is eaten as a vegetable
- Examples: Tomatoes, Carrots, Onions, Cabbage

✅ **Fruits** - If it's sweet and eaten as fruit
- Examples: Bananas, Mangoes, Pineapples, Oranges

✅ **Grains** - If it's a cereal, grain, or legume
- Examples: Rice, Corn, Beans, Millet

✅ **Poultry** - If it comes from birds
- Examples: Chicken, Eggs, Duck, Turkey

✅ **Meat** - If it's animal meat or fish
- Examples: Beef, Pork, Goat, Fish

✅ **Dairy** - If it's milk-based
- Examples: Fresh Milk, Cheese, Yogurt

✅ **Spices** - If it's used for seasoning
- Examples: Pepper, Ginger, Garlic, Spices

## Common Questions

### Q: What if my product fits multiple categories?
**A:** Choose the PRIMARY category. For example:
- Tomatoes → Vegetables (even though technically a fruit)
- Coconut → Fruits (even though it has milk)

### Q: Can I add a custom category?
**A:** No, only the 7 predefined categories are allowed. This ensures consistency across the platform.

### Q: What happens if I select the wrong category?
**A:** You can edit the product and change the category anytime before admin approval.

### Q: Will my product show in the shop immediately?
**A:** No, admin must approve it first. Then it appears in the selected category.

## Error Messages

### "Category is required"
- **Cause**: You didn't select a category
- **Fix**: Select a category from the dropdown

### "Category must be one of: Vegetables, Fruits..."
- **Cause**: Invalid category submitted (shouldn't happen in UI)
- **Fix**: Use the dropdown, don't try to bypass validation

### "Unit is required"
- **Cause**: You didn't select a unit
- **Fix**: Select a unit from the dropdown

## Visual Guide

### In Product Form:
```
┌─────────────────────────────────┐
│ Category *                      │
│ ┌─────────────────────────────┐ │
│ │ 🥬 Vegetables            ▼  │ │
│ └─────────────────────────────┘ │
│                                 │
│ When clicked:                   │
│ ┌─────────────────────────────┐ │
│ │ 🥬 Vegetables               │ │
│ │ 🍎 Fruits                   │ │
│ │ 🌾 Grains                   │ │
│ │ 🐔 Poultry                  │ │
│ │ 🥩 Meat                     │ │
│ │ 🥛 Dairy                    │ │
│ │ 🌶️ Spices                   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### In Product Card:
```
┌─────────────────────────────────┐
│  [Product Image]                │
│                                 │
│  Fresh Tomatoes                 │
│  [Pending]                      │
│                                 │
│  Description here...            │
│                                 │
│  Category: 🥬 Vegetables        │
│  Price: GH₵ 15.00 / kg          │
│  Stock: 100 kg                  │
│                                 │
│  [Edit]  [Delete]               │
└─────────────────────────────────┘
```

### In Shop Sidebar:
```
┌─────────────────┐
│ Categories      │
├─────────────────┤
│ 🌾 All (45)     │
│ 🥬 Vegetables(12)│ ← Active
│ 🍎 Fruits (8)   │
│ 🌾 Grains (10)  │
│ 🐔 Poultry (5)  │
│ 🥩 Meat (6)     │
│ 🥛 Dairy (2)    │
│ 🌶️ Spices (2)   │
└─────────────────┘
```

## Best Practices

### ✅ DO:
- Select the most appropriate category
- Use standard units (kg, piece, etc.)
- Be consistent with similar products
- Check category before submitting

### ❌ DON'T:
- Try to create custom categories
- Leave category blank
- Use wrong category intentionally
- Mix up units (e.g., kg for eggs)

## Quick Test

Test your understanding:

1. **Cassava** → ? 
   - Answer: 🥬 Vegetables

2. **Fresh Milk** → ?
   - Answer: 🥛 Dairy

3. **Whole Chicken** → ?
   - Answer: 🐔 Poultry

4. **White Rice** → ?
   - Answer: 🌾 Grains

5. **Hot Pepper** → ?
   - Answer: 🌶️ Spices

## Summary

✅ 7 valid categories with icons
✅ 6 valid units
✅ Frontend + Backend validation
✅ Clear error messages
✅ Visual feedback with icons
✅ Consistent across all pages

**Remember**: Categories help customers find your products easily. Choose wisely! 🎯

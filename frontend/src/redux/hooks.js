import { useDispatch, useSelector } from 'react-redux';

// Custom hooks without type annotations
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

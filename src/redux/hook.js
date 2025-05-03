import { useDispatch, useSelector } from 'react-redux';

// In JavaScript, we don't have type annotations, so we just export the basic hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
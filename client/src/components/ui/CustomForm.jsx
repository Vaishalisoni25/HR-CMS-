import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./styles.scss";

const runValidator = (validator, value, formData) => {
  if (!validator) return "";
  return validator(value, formData) || "";
};

const CustomForm = forwardRef(
  (
    {
      initialValues = {},
      onSubmit,
      children,
      layout = "block",
      columns = 2,
      gap = "16px",
      validateForm,
      loading = false,
      className = "",
      style = {},
    },
    ref
  ) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const resetForm = () => {
      setFormData(initialValues);
      setErrors({});
    };

    useImperativeHandle(ref, () => ({
      resetForm,
      getData: () => formData,
    }));

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
      }));
    };

    const handleBlur = (name, validator) => {
      const message = runValidator(validator, formData[name], formData);
      setErrors((prev) => ({ ...prev, [name]: message }));
    };

    const validateAll = () => {
      const newErrors = {};

      if (validateForm) {
        const formError = validateForm(formData);
        if (formError) newErrors.form = formError;
      }

      React.Children.forEach(children, (child) => {
        if (!child.props?.name) return;

        const validator = child.props.validate;
        const message = runValidator(validator, formData[child.props.name], formData);

        if (message) newErrors[child.props.name] = message;
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateAll()) return;
      onSubmit(formData);
    };

    const enhancedChildren = React.Children.map(children, (child) => {
      if (!child.props?.name) return child;

      const name = child.props.name;
      const validator = child.props.validate;

      const baseProps = {
        name,
        value: formData[name] || "",
        onChange: handleChange,
        onBlur: () => handleBlur(name, validator),
      };

      // MUI TextField support
      if (child.type?.muiName === "TextField") {
        return React.cloneElement(child, {
          ...baseProps,
          error: Boolean(errors[name]),
          helperText: errors[name] || "",
        });
      }

      // Checkbox
      if (child.props.type === "checkbox") {
        return React.cloneElement(child, {
          ...child.props,
          name,
          checked: formData[name] || false,
          onChange: handleChange,
        });
      }

      // File input
      if (child.props.type === "file") {
        return React.cloneElement(child, {
          ...child.props,
          name,
          onChange: handleChange,
        });
      }

      return React.cloneElement(child, {
        ...child.props,
        ...baseProps,
      });
    });

    return (
      <form
        onSubmit={handleSubmit}
        className={`custom-form ${layout === "grid" ? "grid" : ""} ${className}`}
        style={{
          gridTemplateColumns: layout === "grid" ? `repeat(${columns}, 1fr)` : undefined,
          gap,
          ...style,
        }}
      >
        {errors.form && <div className="form-error">{errors.form}</div>}

        {enhancedChildren}

        <button
          type="submit"
          className={`submit-btn ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <button type="button" className="reset-btn" onClick={resetForm}>
          Reset
        </button>
      </form>
    );
  }
);

export default CustomForm;

import React from 'react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button'; 

const types = {
  INPUT: 'input',
  SELECT: 'select',
};

function CommanForm({ formControls, formData, setFormData, onSubmit, buttonText,isBtnDisabled  }) {
  function rendersInputByComponentType(getcontrolItem) {
    let element = null;
    const value = formData[getcontrolItem.name] || '';

    switch (getcontrolItem.componentType) {
      case types.INPUT:
        element = (
          <Input
            name={getcontrolItem.name}
            placeholder={getcontrolItem.placeholder}
            id={getcontrolItem.name}
            type={getcontrolItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getcontrolItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case 'select':
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getcontrolItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger>
              <SelectValue placeholder={getcontrolItem.label} />
            </SelectTrigger>

            <SelectContent>
              {getcontrolItem.options &&
                getcontrolItem.options.length > 0 &&
                getcontrolItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.id}>
                    {optionItem.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
        break;

      case 'textarea':
        element = (
          <Textarea
            name={getcontrolItem.name}
            placeholder={getcontrolItem.placeholder}
            id={getcontrolItem.name}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getcontrolItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <input
            name={getcontrolItem.name}
            placeholder={getcontrolItem.placeholder}
            id={getcontrolItem.name}
            type={getcontrolItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getcontrolItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-col gap-3'>
        {formControls.map((controlItem) => (
          <div className='grid w-full gap-1.5' key={controlItem.name}>
            <Label className='mb-1'>{controlItem.label}</Label>
            {rendersInputByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled = {isBtnDisabled} type='submit' className='mt-2 w-full'>
        {buttonText || 'Submit'}
      </Button>
    </form>
  );
}

export default CommanForm;
